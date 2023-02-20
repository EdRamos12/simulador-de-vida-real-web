import { useCallback, useEffect, useState } from "react";

export default function WindowComponent() {
  const [windowPosition, setWindowPosition] = useState({
    x: 0,
    y: 0
  });

  const [offset, setOffset] = useState({
    x: 0,
    y: 0
  })
  
  const handleDragMove = useCallback(({clientX, clientY}: MouseEvent) => {
    setWindowPosition({
      x: clientX,
      y: clientY
    });
  }, []);

  useEffect(() => {
    const windowID = document.getElementById('teste')
    
    setWindowPosition({
      x: window.innerWidth - (window.innerWidth / 2) - (windowID!.clientWidth / 2),
      y: window.innerHeight - (window.innerHeight / 2) - (windowID!.clientHeight / 2)
    });
  }, [])

  const mouseUp = () => {
    window.removeEventListener('mousemove', handleDragMove, true);
  }

  useEffect(() => {
    window.addEventListener('mouseup', mouseUp);
  }, []);

  return (
    <div 
      className="window active"
      id='teste'
      style={{
        position: 'absolute',
        top: `${windowPosition.y - offset.y}px`,
        left: `${windowPosition.x - offset.x}px`
      }}
    >
      <div 
        className="title-bar"
      >
        <div 
          className="title-bar-text"
          onMouseDown={({ clientX, clientY }) => {
            setOffset(current => ({
              x: clientX - (windowPosition.x - current.x),
              y: clientY - (windowPosition.y - current.y),
            }))
            window.addEventListener('mousemove', handleDragMove, true)
          }}
          style={{
            userSelect: 'none'
          }}
        >A window with contents</div>
        <div className="title-bar-controls">
          <button aria-label="Close"></button>
        </div>
      </div>
      <div className="window-body has-space">
        <p>There's so much room for activities!</p>
      </div>
    </div>
  )
}