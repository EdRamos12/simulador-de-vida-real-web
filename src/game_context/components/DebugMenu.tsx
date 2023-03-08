import { useGameAPIContext } from "../GameContextAPI";

export default function DebugMenu() {
  const {increaseMoney, money} = useGameAPIContext();

  return <div>
    <div>
      status: {money}
    </div>
    <button onClick={() => increaseMoney(1)}>
      get moneys: 1
    </button>
  </div>
}