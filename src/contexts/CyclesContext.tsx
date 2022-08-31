import { differenceInSeconds } from "date-fns";
import { createContext, ReactNode, useEffect, useReducer, useState } from "react";
import { ActionTypes, addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { Cycle, cyclesReducers } from "../reducers/cycles/reducer";


interface CreateCycleData {
  task: string;
  minutesAmount: number;
}


interface CycleContextType{
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
}

interface CyclesContextProviderProps{
  children: ReactNode
}

export const CyclesContext = createContext({} as CycleContextType)

export function CyclesContextProvider({ children }:CyclesContextProviderProps){
  const [cyclesState, dispatch] = useReducer(cyclesReducers, 
     {
    cycles: [],
    activeCycleId: null
  }, () => {
      const storedStateAsJSON = localStorage.getItem('@ignite-timer:cycles-state-1.0.0');

      if(storedStateAsJSON){
        return JSON.parse(storedStateAsJSON)
      }
  })

  const{cycles, activeCycleId } = cyclesState

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if(activeCycle){
     return differenceInSeconds(
        new Date(),
        new Date(activeCycle.startDate))
    }
    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)
    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
  },[cyclesState])

  function markCurrentCycleAsFinished(){
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function setSecondsPassed(seconds: number){
    setAmountSecondsPassed(seconds)
  }

  function createNewCycle(data: CreateCycleData){
    const id = String(new Date().getTime())

    const newCycle:Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date()
    }

    dispatch(addNewCycleAction(newCycle))
    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle(){
    dispatch(interruptCurrentCycleAction())
  }

  return(
    <CyclesContext.Provider value={{
      cycles,
      activeCycle, 
      activeCycleId, 
      markCurrentCycleAsFinished, 
      amountSecondsPassed,
      setSecondsPassed,
      createNewCycle,
      interruptCurrentCycle
      }}>
        { children }
      </CyclesContext.Provider>
  )
}