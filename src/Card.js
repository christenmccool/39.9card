import React from "react";
import "./Card.css"


const Card = ({image, code, angle}) => {
  const style = {transform: `rotate(${angle}deg)`}
  return (
    <img src={image} alt={code} className="Card" style={style}/>
  )
}

export default Card;