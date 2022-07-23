import { Cycle } from './reducer'

export enum ActionTypes {
  ADD_NEW_CYCLE = 'ADD_NEW_CYCLE',
  INTERRUPT_CURRENT_CYCLE = 'INTERRUPT_CURRENT_CYCLE',
  MARK_CURRENT_CYCLE_AS_FINISHED = 'MARK_CURRENT_CYCLE_AS_FINISHED',
}

export const addNewCycleAction = (newCycle: Cycle) => ({
  type: ActionTypes.ADD_NEW_CYCLE,
  payload: {
    newCycle,
  },
})

export const markCurrentCycleAsFinishedAction = () => ({
  type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
})

export const interruptCurrentCycleAction = () => ({
  type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
})
