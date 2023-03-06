import { createContext, useContext, useReducer } from "react";
import { createPortal } from "react-dom";
import WindowComponent from "./WindowComponent";

export const WindowContext = createContext({} as any);

export const ADD = 'ADD';
export const REMOVE = 'REMOVE';
export const UPDATE_POS = 'UPDATE_POS';

export const windowReducer = (state: any, action: any) => {
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
      // console.log(action.payload.pos.x);
      const WindowPositionArray = state;
      WindowPositionArray[WindowPositionArray.indexOf(WindowPositionArray.find((t: any) => t.id === action.payload.id))] = {
        ...WindowPositionArray[WindowPositionArray.indexOf(WindowPositionArray.find((t: any) => t.id === action.payload.id))],
        pos: {
          x: action.payload.pos.x - action.payload.pos.offsetX,
          y: action.payload.pos.y - action.payload.pos.offsetY,
        }
      }
      //console.log(WindowPositionArray[WindowPositionArray.indexOf(WindowPositionArray.find((t: any) => t.id === action.payload.id))]);
      return WindowPositionArray;
    default:
      return state;
  }
};


export const WindowProvider = (props: any) => {
  const [toast, toastDispatch] = useReducer(windowReducer, []);
  const toastData = { toast, toastDispatch };

  return (
    <WindowContext.Provider value={toastData}>
      {props.children}

      {toast.map((t: any) => createPortal(<>
        <WindowComponent key={t.id} toastData={t as any} children={t.children} />        
      </>, document.body))}
    </WindowContext.Provider>
  );
};

export const useWindowContext = () => {
  return useContext(WindowContext);
};