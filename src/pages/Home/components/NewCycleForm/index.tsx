import { useFormContext } from "react-hook-form";
import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import { useContext } from "react";
import { CyclesContext } from "../../../../contexts/CyclesContext";

export function NewCycleForm(){
  const { activeCycle } = useContext(CyclesContext)
  const { register } = useFormContext()

  return (
    <FormContainer>        
    <label htmlFor="task">Vou trabalhar em</label>
    <TaskInput 
      id="task" 
      list="task-suggestions"
      type="text" 
      placeholder="Dê um nome para o seu projeto"
      disabled={!!activeCycle} //converte o valor para boolean, se tiver ciclo ativo = true
      {...register('task')}
    />

    <datalist id="task-suggestions">
      <option value="Projeto 1"/>
      <option value="Projeto 2"/>
      <option value="Projeto 3"/>
    </datalist>

    <label htmlFor="minutesAmount">durante</label>
    <MinutesAmountInput
      type="number" 
      id="minutesAmount" 
      placeholder="00"
      disabled={!!activeCycle}
      step={5}
      min={1}
      max={60}
      {...register('minutesAmount', {valueAsNumber: true})}
    />

    <span>minutos.</span>
  </FormContainer> 
  )
}