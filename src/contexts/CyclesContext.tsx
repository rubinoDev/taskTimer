import { createContext, ReactNode, useReducer, useState } from "react";

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
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

interface CyclesState{
  cycles: Cycle[]
  activeCycleId : number | null
}

export const CyclesContext = createContext({} as CycleContextType)

export function CyclesContextProvider({ children }:CyclesContextProviderProps){
  const [cyclesState, dispatch] = useReducer((state: CyclesState, action: any) => {
    if(action.type === 'ADD_NEW_CYCLE'){
      return {
        ...state,
        cycles: [...state.cycles, action.payload.newCycle ],
        activeCycleId: action.payload.newCycle.id
      }
    }
    return state;
  }, {
    cycles: [],
    activeCycleId: null
  })

  
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  
  const { cycles, activeCycleId } = cyclesState

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  function markCurrentCycleAsFinished(){
    dispatch({
      type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
      payload:{
        activeCycleId
      }
    })
    
    // setCycles(prevState=>
    //   prevState.map(cycle => {
    //     if(cycle.id === activeCycleId){
    //       return {...cycle, finishedDate: new Date()}
    //   } else{
    //     return cycle
    //   }
    // }),
    // )
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

    dispatch({
      type: 'ADD_NEW_CYCLE',
      payload:{
        newCycle
      }
    })
    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle(){
    // setCycles(prevState =>
    //   prevState.map(cycle => {
    //     if(cycle.id === activeCycleId){
    //       return {...cycle, interruptedDate: new Date()}
    //   } else{
    //     return cycle
    //   }
    // }))

    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload:{
        activeCycleId
      }
    })

    setActiveCycleId(null)
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