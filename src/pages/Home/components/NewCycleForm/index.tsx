import { useFormContext } from 'react-hook-form'

import { useCycleContext } from './../../../../contexts/CyclesContext'
import { FormContainer, TaskInput, MinutesAmountInput } from './styles'

export const NewCycleForm = () => {
  const { register } = useFormContext()
  const { activeCycle } = useCycleContext()

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        id="task"
        type="text"
        disabled={!!activeCycle}
        list="task-suggestions"
        {...register('task')}
        placeholder="Dê um nome para o seu projeto"
      />

      <datalist id="task-suggestions">
        <option value="Projeto 1" />
        <option value="Projeto 2" />
      </datalist>

      <label htmlFor="minutesAmount">durante</label>
      <MinutesAmountInput
        type="number"
        id="minutesAmount"
        placeholder="00"
        disabled={!!activeCycle}
        step={5}
        min={5}
        max={60}
        {...register('minutesAmount', {
          valueAsNumber: true,
        })}
      />

      <span>minutos</span>
    </FormContainer>
  )
}
