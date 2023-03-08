import { useCallback, useEffect, useState } from "react";
import { REMOVE, UPDATE_POS, useWindowContext, WindowComponentInterface } from "./WindowContextAPI";

export default function WindowComponent({ children, windowData }: {windowData: WindowComponentInterface, children: WindowComponentInterface['children']}) {
  const { dispatch } = useWindowContext();
  
  const [windowPosition, setWindowPosition] = useState({
    x: windowData.pos?.x || -500,
    y: windowData.pos?.y || -500
  });

  const [offset, setOffset] = useState({
    x: 0,
    y: 0
  })

  const updatePositionInContext = () => {
    dispatch({
      type: UPDATE_POS,
      payload: {
        id: windowData.id,
        pos: {
          x: windowPosition.x,
          y: windowPosition.y,
          offsetX: offset.x,
          offsetY: offset.y,
        }
      }
    })
  };
  
  const handleDragMove = useCallback(({clientX, clientY}: MouseEvent) => {
    setWindowPosition({
      x: clientX,
      y: clientY
    });
  }, []);

  const mouseUp = () => {
    window.removeEventListener('mousemove', handleDragMove, true);
  }

  useEffect(() => {
    const windowID = document.getElementById(windowData.id as string)
    
    if (windowPosition.x === -500 && windowPosition.y === -500) setWindowPosition({
      x: window.innerWidth - (window.innerWidth / 2) - ((windowID?.clientWidth || 300) / 2),
      y: window.innerHeight - (window.innerHeight / 2) - ((windowID?.clientHeight || 300) / 2)
    });

    window.addEventListener('mouseup', mouseUp);
  }, [])
  
  useEffect(() => {
    // console.log('clientPos: ', windowPosition);
    // console.log('clientOffsetPos: ', offset);

    updatePositionInContext();
  }, [windowPosition, offset])

  return (
    <div 
      className="window active"
      id={windowData.id}
      style={{
        position: 'absolute',
        top: `${windowPosition.y - offset.y}px`,
        left:  `${windowPosition.x - offset.x}px`,
      }}
    >
      <div 
        className="title-bar"
        style={{
          padding: 0
        }}
      >
        <div 
          className="title-bar-text"
          style={{
            userSelect: 'none',
            display: 'block',
            width: '100%',
            lineHeight: '200%',
            marginLeft: '6px',
          }}
          onMouseDown={({ clientX, clientY }) => {
            setOffset(current => ({
              x: clientX - (windowPosition.x - current.x),
              y: clientY - (windowPosition.y - current.y),
            }))
            window.addEventListener('mousemove', handleDragMove, true)
          }}
        >{windowData.title}</div>
        {windowData.type === 'custom' && <div className="title-bar-controls" style={{
          margin: '6px',
          marginTop: '0px',
          marginLeft: '0px',
        }}>
          <button onClick={() => dispatch({
            type: REMOVE,
            payload: {
              id: windowData.id
            }
          })} aria-label="Close" />
        </div>}
      </div>
      <div className="window-body has-space">
        {windowData.type === 'custom' && children}
        {windowData.type !== 'custom' && <>
        
        </>}
      </div>
    </div>
  )
}