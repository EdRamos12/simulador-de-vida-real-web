import { useGameAPIContext } from "../GameContextAPI";
import { DEPRESSION_MAX, ENERGY_INIT_VALUE, HUNGER_MAX, INTELLIGENCE_MAX, STRENGTH_MAX, THIRSTY_MAX } from "../GameVarLimits";

export default function GameMain() {
  const {
    increaseMoney, 
    energy, 
    hunger, 
    thirsty,
    strength,
    money,
    intelligence,
    depression,
    day
  } = useGameAPIContext();

  return <div className="">
    <div>Dia: {day}</div>
    <div>
      <div>Energia:</div>
      <div>Sede:</div>
      <div>Força:</div>
      <div>Dinheiro:</div>
      <div>Inteligência:</div>
      <div>Depressão:</div>
    </div>
    <div>
      <div>{energy} / {ENERGY_INIT_VALUE}</div>
      <div>{hunger} / {HUNGER_MAX}</div>
      <div>{thirsty} / {THIRSTY_MAX}</div>
      <div>{strength} / {STRENGTH_MAX}</div>
      <div>{money}</div>
      <div>{intelligence} / {INTELLIGENCE_MAX}</div> 
      <div role="progressbar" className="animate">
        <span style={{
          width: `${(depression * 100) / DEPRESSION_MAX}%`
        }} />
      </div>
    </div>
  </div>
}