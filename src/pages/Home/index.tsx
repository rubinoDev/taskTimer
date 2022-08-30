import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountdownButton, StopCountdownButton} from "./styles";
import { createContext, useEffect, useState } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from 'zod'
import { FormProvider, useForm } from "react-hook-form";


interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CycleContextType{
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  markCurrentCycleAsFinished: () => void;
  amountSecondsPassed: number
}

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number()
  .min(1, 'O ciclo precisa ser de no mínimo 5 minutos')
  .max(60, 'O ciclo precisa ser de no máximo 60 minutos')
}) 

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export const CyclesContext = createContext({} as CycleContextType)

export function Home(){
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0
    }
  });

  const { handleSubmit, watch, reset } = newCycleForm

  function markCurrentCycleAsFinished(){
    setCycles(prevState=>
      prevState.map(cycle => {
        if(cycle.id === activeCycleId){
          return {...cycle, finishedDate: new Date()}
      } else{
        return cycle
      }
    }),
    )
  }

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

  const task = watch('task');
  const isSubmitDisabled = !task

  return(
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>

      <CyclesContext.Provider value={{activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed}}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm/>
        </FormProvider>
        <Countdown/>

      </CyclesContext.Provider>

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