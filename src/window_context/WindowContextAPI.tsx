import { createContext, Dispatch, Reducer, useContext, useReducer } from "react";
import { createPortal } from "react-dom";
import WindowComponent from "./WindowComponent";

export type WindowButtonsType = {
  [label: string]: () => void | any;
}

export interface WindowComponentInterface {
  id?: string, 
  state?: boolean,
  title?: string, 
  type?: 'custom' | 'warning' | 'error' | 'info', 
  children?: React.ReactNode, 
  pos?: {
    x: number, 
    y: number,
    offsetX?: number,
    offsetY?: number
  },
  text?: string,
  buttons?: WindowButtonsType
}

interface Action {
  type: 'ADD' | 'REMOVE' | 'UPDATE_POS' | 'UPDATE_ACTIVE',
  payload: WindowComponentInterface,
}

export const WindowContext = createContext<{state: Array<WindowComponentInterface>, dispatch: Dispatch<Action>}>({} as any);

export const ADD = 'ADD';
export const REMOVE = 'REMOVE';
export const UPDATE_POS = 'UPDATE_POS';
export const UPDATE_ACTIVE = 'UPDATE_ACTIVE';

export const windowReducer: Reducer<Array<WindowComponentInterface>, Action> = (state, action) => {
  const {payload, type} = action;
  const WindowPositionArray = state;
  
  const updateWindowState = (check_current_payload = false, custom_id?: string) => {
    return WindowPositionArray.map((current_state, index) => {

      if ((custom_id || payload.id) !== state[index].id && check_current_payload) return {
        ...current_state,
        state: false
      };

      return {
        ...current_state,
        state: true
      }
    }) as Array<WindowComponentInterface>;
  }
  
  switch (type) {
    case ADD:
      if (payload.type === 'custom') {
        return [
          ...updateWindowState(),
          {
            id: `${payload.id}_${Date.now()}`,
            state: true,
            title: payload.title,
            type: payload.type,
            children: payload.children,
            pos: {
              x: 0,
              y: 0
            }
          }
        ] as Array<WindowComponentInterface>;
      }
      return [
        ...updateWindowState(),
        {
          id: `${payload.type}_${Date.now()}`,
          state: true,
          text: payload.text,
          type: payload.type,
          buttons: payload.buttons
        }
      ] as Array<WindowComponentInterface>;
    case REMOVE:
      return updateWindowState(true, WindowPositionArray[WindowPositionArray.length - 1].id).filter((t: any) => t.id !== payload.id);
    case UPDATE_POS:
      const sortedArray = updateWindowState(true);

      sortedArray[sortedArray.indexOf(sortedArray.find(t => t.id === payload.id) as WindowComponentInterface)] = {
        ...sortedArray[sortedArray.indexOf(sortedArray.find(t => t.id === payload.id) as WindowComponentInterface)],
        pos: {
          x: payload.pos?.x as number,
          y: payload.pos?.y as number,
          offsetX: payload.pos?.offsetX,
          offsetY: payload.pos?.offsetY
        }
      }
      return sortedArray;
    case UPDATE_ACTIVE:
      return updateWindowState(true);
    default:
      return state;
  }
};

export const WindowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(windowReducer, []);
  const data = { state, dispatch };

  return (
    <WindowContext.Provider value={data}>
      {children}

      {state.map(window => createPortal(
        <WindowComponent key={window.id} windowData={window} children={window.children} />, 
        document.body
      ))}
    </WindowContext.Provider>
  );
};

export const useWindowContext = () => {
  return useContext(WindowContext);
};