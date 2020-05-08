import React, { useState, useEffect } from 'react';
import './Timer.css'

const useTimer = (props) => {
  const [timeLeft, setTimeLeft] = React.useState(30)
  const [isActive, setIsActive] = React.useState(true)

  React.useEffect(() => {
    let interval = null;
    if(timeLeft > 0 && isActive) {
      interval = setInterval(() => {
        setTimeLeft( timeLeft => timeLeft - 1);
      }, 1000)
    } else if ( timeLeft === 0 && isActive){
      clearInterval(interval)
      props.endGame()
      toggle()
    }
    return () => clearInterval(interval)
  }, [timeLeft, isActive])

  function toggle(){
    setIsActive(!isActive)
  }

    return [timeLeft, isActive]
};

export default useTimer;
