import { useWindowContext } from "@/window_context/WindowContextAPI";
import { createContext, useEffect, useState } from "react";
import { DEPRESSION_INIT_VALUE, ENERGY_INIT_VALUE, HUNGER_INIT_VALUE, INTELLIGENCE_INIT_VALUE, JOB_INIT_VALUE, MONEY_INIT_VALUE, STRENGTH_INIT_VALUE, THIRSTY_INIT_VALUE } from "./GameVarLimits";

export interface ITodo {
  energy: number;
  hunger: number;
  thirsty: number;
  strength: number;
  money: number;
  intelligence: number;
  depression: number;
  job: string;
  profile_pic: number;
}

export type TodoContextType = {
  todos: ITodo[];
  saveTodo: (todo: ITodo) => void;
  updateTodo: (id: number) => void;
};

export const TodoContext = createContext<TodoContextType | any>(null);

const TodoProvider: React.FC = () => {
  const { toastDispatch } = useWindowContext();

  // general settings
  const [day, setDay] = useState(1);

  // status
  const [energy, setEnergy] = useState(ENERGY_INIT_VALUE);
  const [hunger, setHunger] = useState(HUNGER_INIT_VALUE);
  const [thirsty, setThirsty] = useState(THIRSTY_INIT_VALUE);
  const [strength, setStrength] = useState(STRENGTH_INIT_VALUE);
  const [money, setMoney] = useState(MONEY_INIT_VALUE);
  const [intelligence, setIntelligence] = useState(INTELLIGENCE_INIT_VALUE);
  const [depression, setDepression] = useState(DEPRESSION_INIT_VALUE);
  const [job, setJob] = useState(JOB_INIT_VALUE);

  // inventory?
  const [foodStorage, setFoodStorage] = useState(20);

  const triggerDeath = () => {
    toastDispatch({
      type: 'alert',
      
    })
  }

  useEffect(() => {
    if (energy <= 0) triggerDeath();
  }, [energy]);


  const decreaseEnergy = (amount = 1) => {
    setEnergy(current => current - amount);
  }

  const increaseHungry = (amount = 1) => {
    setHunger(current => current + amount);
  }

  const increaseThirstiness = (amount = 1) => {
    setThirsty(current => current + amount);
  }


  const increaseIntelligence = (amount = 1) => {
    if (intelligence === 20) return false;

    setIntelligence(current => current + amount);
    return true;
  }

  const drinkWater = (amount = 1) => {
    setThirsty(current => current - amount);
    return true;
  }

  const sleep = () => {
    if (energy === 10) return false;

    setEnergy(10);
    setDay(current => current + 1)
    return true;
  }

  return <TodoContext.Provider value={{}} />
}