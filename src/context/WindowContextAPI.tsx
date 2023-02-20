import { createContext, useReducer } from "react";
import { createPortal } from "react-dom";

export const WindowContext = createContext({} as any);

export const ADD = 'ADD';
export const REMOVE = 'REMOVE';

export const windowReducer = (state: any, action: any) => {
  switch (action.type) {
    case ADD:
      if (action.payload.type === 'custom') {
        return [
          ...state,
          {
            id: action.payload.id,
            title: action.payload.title,
            type: action.payload.type
          }
        ];
      }
      return [
        ...state,
        {
          id: +new Date(),
          text: action.payload.content,
          type: action.payload.type,
          buttons: action.payload.buttons
        }
      ];
    case REMOVE:
      return state.filter((t: any) => t.id !== action.payload.id);
    default:
      return state;
  }
};


export const WindowProvider = (props: any) => {
  const [toast, toastDispatch] = useReducer(windowReducer, []);
  const toastData = { toast, toastDispatch };
  return (
    <WindowContext.Provider value={toastData}>
      {createPortal(<>
        {toast.map((t: any) => {
          
        })}
      </>, document.body)}
    </WindowContext.Provider>
  );
};