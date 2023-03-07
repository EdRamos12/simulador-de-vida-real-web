import { createContext, Reducer, useContext, useReducer } from "react";
import { createPortal } from "react-dom";
import WindowComponent from "./WindowComponent";

export const WindowContext = createContext({} as any);

export const ADD = 'ADD';
export const REMOVE = 'REMOVE';
export const UPDATE_POS = 'UPDATE_POS';

export interface WindowComponentInterface {
  id: string, 
  title: string, 
  type: 'custom' | string, 
  children?: React.ReactNode, 
  pos?: {
    x: number, 
    y: number,
    offsetX?: number,
    offsetY?: number
  },
  text?: string,
  buttons?: string
}

interface Action {
  type: 'ADD' | 'REMOVE' | 'UPDATE_POS',
  payload: WindowComponentInterface,
}

export const windowReducer: Reducer<Array<WindowComponentInterface>, Action> = (state, action) => {
  const {payload, type} = action;
  
  switch (type) {
    case ADD:
      if (payload.type === 'custom') {
        return [
          ...state,
          {
            id: `${payload.id}_${Date.now()}`,
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
        ...state,
        {
          id: `${payload.type}_${Date.now()}`,
          text: payload.text,
          type: payload.type,
          buttons: payload.buttons
        }
      ] as Array<WindowComponentInterface>;;
    case REMOVE:
      return state.filter((t: any) => t.id !== payload.id);
    case UPDATE_POS:
      const WindowPositionArray = state;
      WindowPositionArray[WindowPositionArray.indexOf(WindowPositionArray.find(t => t.id === payload.id) as WindowComponentInterface)] = {
        ...WindowPositionArray[WindowPositionArray.indexOf(WindowPositionArray.find(t => t.id === payload.id) as WindowComponentInterface)],
        pos: {
          x: (payload.pos?.x || 0) - (payload.pos?.offsetX || 0),
          y: (payload.pos?.y || 0) - (payload.pos?.offsetY || 0),
        }
      }
      return WindowPositionArray;
    default:
      return state;
  }
};

export const WindowProvider: React.FC<any> = ({ children }) => {
  const [state, dispatch] = useReducer(windowReducer, []);
  const data = { state, dispatch };

  return (
    <WindowContext.Provider value={data}>
      {children}

      {state.map((t: WindowComponentInterface) => createPortal(<WindowComponent key={t.id} toastData={t} children={t.children} />, document.body))}
    </WindowContext.Provider>
  );
};

export const useWindowContext = () => {
  return useContext(WindowContext);
};