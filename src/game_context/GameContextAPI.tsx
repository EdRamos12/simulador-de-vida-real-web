import { ADD, useWindowContext } from "@/window_context/WindowContextAPI";
import { createContext, useContext, useState } from "react";
import { DEPRESSION_INIT_VALUE, DEPRESSION_MAX, ENERGY_INIT_VALUE, HUNGER_INIT_VALUE, HUNGER_MAX, INTELLIGENCE_INIT_VALUE, INTELLIGENCE_MAX, JOB_INIT_VALUE, MONEY_INIT_VALUE, STRENGTH_INIT_VALUE, STRENGTH_MAX, THIRSTY_INIT_VALUE, THIRSTY_MAX } from "./GameVarLimits";

type GameContextAPIType = {
  energy: number;
  hunger: number;
  thirsty: number;
  strength: number;
  money: number;
  intelligence: number;
  depression: number;
  job: string;
  foodStorage: number;
  day: number;

  triggerDeath: () => void;
  decreaseEnergy: () => boolean;
  increaseHungry: (amount?: number) => boolean | void;
  increaseThirstiness: (amount?: number) => boolean | void;
  increaseDepression: (amount?: number) => boolean | void;

  increaseIntelligence: () => boolean;
  decreaseDepression: () => boolean;
  drinkWater: () => boolean;
  sleep: () => boolean;
  eatFood: (amount?: number, discount_from_storage?: boolean) => boolean;
  increaseMoney: (amount: number) => boolean;
  decreaseMoney: (amount: number) => boolean;
  increaseStrength: () => boolean;
}

export const GameContextAPI = createContext<GameContextAPIType>({} as GameContextAPIType);

export const GameAPIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { dispatch } = useWindowContext();

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

  // TODO: set list of jobs
  const [job, setJob] = useState(JOB_INIT_VALUE);

  // inventory?
  const [foodStorage, setFoodStorage] = useState(20);

  const triggerDeath = () => {
    dispatch({
      type: ADD,
      payload: {
        // TODO: add death textbox
      }
    })
  }

  const decreaseEnergy = (amount = 1) => {
    if (energy <= 0) triggerDeath();

    setEnergy(current => current - amount);
    return true;
  }

  const increaseHungry = (amount = 1) => {
    if (hunger >= HUNGER_MAX) return triggerDeath();

    setHunger(current => current + amount);
    return true;
  }

  const increaseThirstiness = (amount = 1) => {
    if (thirsty >= THIRSTY_MAX) return triggerDeath();

    setThirsty(current => current + amount);
    return true;
  }

  const increaseDepression = (amount = 1) => {
    if (depression >= DEPRESSION_MAX) return triggerDeath();

    setDepression(current => current + amount);
    return true;
  }


  const increaseIntelligence = (amount = 1) => {
    if (intelligence >= INTELLIGENCE_MAX) return false;

    setIntelligence(current => current + amount);
    return true;
  }

  const decreaseDepression = (amount = 1) => {
    setDepression(current => current - amount);
    return true;
  }

  const drinkWater = (amount = 1) => {
    if (thirsty <= THIRSTY_INIT_VALUE) return false;

    setThirsty(current => current - amount);
    return true;
  }

  const sleep = () => {
    if (energy >= ENERGY_INIT_VALUE) return false;

    setEnergy(ENERGY_INIT_VALUE);
    setDay(current => current + 1)
    return true;
  }

  const eatFood = (amount = 1, discount_from_storage = true) => {
    if (hunger <= HUNGER_INIT_VALUE || (foodStorage <= 0 && discount_from_storage)) return false;

    setHunger(current => current - amount);
    if (discount_from_storage) setFoodStorage(current => current - amount);
    return true;
  }

  const increaseMoney = (amount: number) => {
    if (money < 0) return false;

    setMoney(current => current + amount);
    return true;
  }

  const decreaseMoney = (amount: number) => {
    if ((money - amount) < 0) return false;
    
    setMoney(current => current - amount);
    return true;
  }

  const increaseStrength = (amount = 1) => {
    if (strength >= STRENGTH_MAX) return false;

    setStrength(current => current + amount);
    return false;
  }

  return <GameContextAPI.Provider value={{
    energy,
    hunger,
    thirsty,
    strength,
    money,
    intelligence,
    depression,
    job,
    foodStorage,
    day,

    triggerDeath,
    decreaseEnergy,
    increaseHungry,
    increaseThirstiness,
    increaseDepression,

    increaseIntelligence,
    decreaseDepression,
    drinkWater,
    sleep,
    eatFood,
    increaseMoney,
    decreaseMoney,
    increaseStrength,
  }}>
    {children}
  </GameContextAPI.Provider>
}

export const useGameAPIContext = () => {
  return useContext(GameContextAPI);
};