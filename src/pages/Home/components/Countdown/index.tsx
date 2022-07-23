import { differenceInSeconds } from 'date-fns'
import { useMemo, useEffect } from 'react'
import { CountdownContainer, Separator } from './styles'
import { useCycleContext } from './../../../../contexts/CyclesContext'

export const Countdown = () => {
  const {
    activeCycle,
    activeCycleId,
    setSecondsPassed,
    amountSecondsPassed,
    markCurrentCycleAsFinished,
  } = useCycleContext()

  const totalSeconds = useMemo(
    () => (activeCycle ? activeCycle.minutesAmount * 60 : 0),
    [activeCycle],
  )

  const currentSeconds = useMemo(
    () => (activeCycle ? totalSeconds - amountSecondsPassed : 0),
    [activeCycle, totalSeconds, amountSecondsPassed],
  )

  const minutesAmount = useMemo(
    () => Math.floor(currentSeconds / 60),
    [currentSeconds],
  )

  const secondsAmount = useMemo(() => currentSeconds % 60, [currentSeconds])

  const minutes = useMemo(
    () => String(minutesAmount).padStart(2, '0'),
    [minutesAmount],
  )

  const seconds = useMemo(
    () => String(secondsAmount).padStart(2, '0'),
    [secondsAmount],
  )

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate),
        )

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()
          setSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    markCurrentCycleAsFinished,
    setSecondsPassed,
  ])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
