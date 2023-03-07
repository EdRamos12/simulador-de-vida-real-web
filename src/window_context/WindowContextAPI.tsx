import { createContext, useContext, useReducer } from "react";
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

export const windowReducer = (state: WindowComponentInterface[], action: Action) => {
  switch (action.type) {
    case ADD:
      if (action.payload.type === 'custom') {
        return [
          ...state,
          {
            id: `${action.payload.id}_${Date.now()}`,
            title: action.payload.title,
            type: action.payload.type,
            children: action.payload.children,
            pos: {
              x: 0,
              y: 0
            }
          }
        ];
      }
      return [
        ...state,
        {
          id: `${action.payload.type}_${Date.now()}`,
          text: action.payload.text,
          type: action.payload.type,
          buttons: action.payload.buttons
        }
      ];
    case REMOVE:
      return state.filter((t: any) => t.id !== action.payload.id);
    case UPDATE_POS:
      const WindowPositionArray = state;
      WindowPositionArray[WindowPositionArray.indexOf(WindowPositionArray.find(t => t.id === action.payload.id) as WindowComponentInterface)] = {
        ...WindowPositionArray[WindowPositionArray.indexOf(WindowPositionArray.find(t => t.id === action.payload.id) as WindowComponentInterface)],
        pos: {
          x: (action.payload.pos?.x || 0) - (action.payload.pos?.offsetX || 0),
          y: (action.payload.pos?.y || 0) - (action.payload.pos?.offsetY || 0),
        }
      }
      return WindowPositionArray;
    default:
      return state;
  }
};

export const WindowProvider = ({ children }: any) => {
  const [toast, toastDispatch] = useReducer(windowReducer as any, []) as any;
  const toastData = { toast, toastDispatch };

  return (
    <WindowContext.Provider value={toastData}>
      {children}

      {toast.map((t: WindowComponentInterface) => createPortal(<>
        <WindowComponent key={t.id} toastData={t} children={t.children} />        
      </>, document.body))}
    </WindowContext.Provider>
  );
};

export const useWindowContext = () => {
  return useContext(WindowContext);
};