import React, {
  createContext,
  useCallback,
  useState,
  useMemo,
  useContext,
} from 'react'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptDate?: Date
  finishedDate?: Date
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
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const activeCycle = useMemo(
    () => cycles.find((cycle) => cycle.id === activeCycleId),
    [cycles, activeCycleId],
  )

  const setSecondsPassed = (secondsPassed: number) => {
    setAmountSecondsPassed(secondsPassed)
  }

  const markCurrentCycleAsFinished = useCallback(() => {
    setCycles((prevState) =>
      prevState.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return {
            ...cycle,
            finishedDate: new Date(),
          }
        }

        return cycle
      }),
    )
  }, [activeCycleId])

  const interruptCurrentCycle = useCallback(() => {
    setCycles((prevState) =>
      prevState.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return {
            ...cycle,
            interruptDate: new Date(),
          }
        }

        return cycle
      }),
    )

    setActiveCycleId(null)
  }, [activeCycleId])

  const createNewCycle = useCallback(
    ({ minutesAmount, task }: CreateCycleData) => {
      const newCycle: Cycle = {
        id: String(new Date().getTime()),
        task,
        minutesAmount,
        startDate: new Date(),
      }

      setActiveCycleId(newCycle.id)
      setCycles((state) => [...state, newCycle])
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
