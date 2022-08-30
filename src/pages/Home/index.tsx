import { HandPalm, Play } from "phosphor-react";
import { useForm, UseFormStateProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { HomeContainer, StartCountdownButton, StopCountdownButton} from "./styles";
import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns/esm";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

export function Home(){
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  function handleCreateNewCycle(data: NewCycleFormData){
    const id = String(new Date().getTime())

    const newCycle:Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date()
    }

    setCycles(cycles => [...cycles, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)

    reset();
  }

  function handleInterruptCycle(){
    setCycles(prevState =>
      prevState.map(cycle => {
        if(cycle.id === activeCycleId){
          return {...cycle, interruptedDate: new Date()}
      } else{
        return cycle
      }
    }))

    setActiveCycleId(null)
  }

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60 

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if(activeCycle){
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  const task = watch('task');
  const isSubmitDisabled = !task

  return(
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>

      <NewCycleForm/>
      <Countdown/>

       {activeCycle ? (
         <StopCountdownButton
         type="button"
         onClick={handleInterruptCycle}
       >
         <HandPalm size={24}/>
         Interromper
       </StopCountdownButton>
       ) : (
        <StartCountdownButton 
        type="submit"
        disabled={isSubmitDisabled}
      >
        <Play size={24}/>
        Começar
      </StartCountdownButton>
       )}
      </form>
    </HomeContainer>
  )
}