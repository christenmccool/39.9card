import React from "react";
import "./Card.css"


const Card = ({image, code, angle, transX, transY}) => {
  const style = {transform: `translateX(${transX}px) translateY(${transY}px) rotate(${angle}deg)`}
  return (
    <img src={image} alt={code} className="Card" style={style}/>
  )
}

export default Card;