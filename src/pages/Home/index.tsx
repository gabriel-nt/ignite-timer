import * as zod from 'zod'
import { FormProvider, useForm } from 'react-hook-form'
import { HandPalm, Play } from 'phosphor-react'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { createContext, useCallback, useMemo, useState } from 'react'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { Countdown } from './components/Countdown'
import { NewCycleForm } from './components/NewCycleForm'

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptDate?: Date
  finishedDate?: Date
}

interface CycleContextType {
  activeCycle: Cycle | undefined
  activeCycleId: string | undefined | null
  markCurrentCycleAsFinished: () => void
  amountSecondsPassed: number
  setSecondsPassed: (seconds: number) => void
}

export const CycleContext = createContext({} as CycleContextType)

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 05 minutos')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export const Home = () => {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const activeCycle = useMemo(
    () => cycles.find((cycle) => cycle.id === activeCycleId),
    [cycles, activeCycleId],
  )

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const setSecondsPassed = (secondsPassed: number) => {
    setAmountSecondsPassed(secondsPassed)
  }

  const { handleSubmit, watch, reset } = newCycleForm

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

  const handleInterruptCycle = useCallback(() => {
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

  const handleCreateNewCycle = useCallback(
    ({ minutesAmount, task }: NewCycleFormData) => {
      const newCycle: Cycle = {
        id: String(new Date().getTime()),
        task,
        minutesAmount,
        startDate: new Date(),
      }

      setActiveCycleId(newCycle.id)
      setCycles((state) => [...state, newCycle])
      setAmountSecondsPassed(0)

      reset()
    },
    [reset],
  )

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <CycleContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            setSecondsPassed,
            amountSecondsPassed,
            markCurrentCycleAsFinished,
          }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CycleContext.Provider>

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterruptCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
