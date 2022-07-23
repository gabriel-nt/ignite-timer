import { differenceInSeconds } from 'date-fns'
import React, {
  createContext,
  useCallback,
  useState,
  useMemo,
  useContext,
  useReducer,
  useEffect,
} from 'react'

import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'

import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CycleContextProviderProps {
  children: React.ReactNode
}

interface CycleContextType {
  cycles: Cycle[]
  amountSecondsPassed: number
  activeCycle: Cycle | undefined
  activeCycleId: string | undefined | null
  interruptCurrentCycle: () => void
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
}

export const CycleContext = createContext({} as CycleContextType)

export const CyclesContextProvider = ({
  children,
}: CycleContextProviderProps) => {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    () => {
      const storedStateAsJSON = localStorage.getItem(
        '@ignite-timer:cycles-state-1.0.0',
      )

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }

      return {
        cycles: [],
        activeCycleId: null,
      }
    },
  )

  const { cycles, activeCycleId } = cyclesState

  const activeCycle = useMemo(
    () => cycles.find((cycle) => cycle.id === activeCycleId),
    [cycles, activeCycleId],
  )

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }

    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

  const setSecondsPassed = (secondsPassed: number) => {
    setAmountSecondsPassed(secondsPassed)
  }

  const markCurrentCycleAsFinished = useCallback(() => {
    dispatch(markCurrentCycleAsFinishedAction())
  }, [])

  const interruptCurrentCycle = useCallback(() => {
    dispatch(interruptCurrentCycleAction())
  }, [])

  const createNewCycle = useCallback(
    ({ minutesAmount, task }: CreateCycleData) => {
      const newCycle: Cycle = {
        id: String(new Date().getTime()),
        task,
        minutesAmount,
        startDate: new Date(),
      }

      dispatch(addNewCycleAction(newCycle))
      setAmountSecondsPassed(0)
    },
    [],
  )

  return (
    <CycleContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        setSecondsPassed,
        amountSecondsPassed,
        markCurrentCycleAsFinished,
        interruptCurrentCycle,
        createNewCycle,
      }}
    >
      {children}
    </CycleContext.Provider>
  )
}

export const useCycleContext = () => useContext(CycleContext)
