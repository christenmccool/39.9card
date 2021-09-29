import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import "./Deck.css"
import Card from "./Card"
import { v4 as uuid } from 'uuid';

const BASE_URL = "http://deckofcardsapi.com/api/deck/";

const Deck = () => {
  const intervalId = useRef(null);
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [auto, setAuto] = useState(false);


  useEffect(() => {
    async function getDeck() {
      const res = await axios.get(`${BASE_URL}/new/shuffle/?deck_count=1`);
      setDeck(res.data.deck_id);
    }
    getDeck();
  }, []);

  useEffect(() => {
    async function drawCard() {
      try {
        const res = await axios.get(`${BASE_URL}/${deck}/draw/?count=1`);
        if (res.data.remaining === 0 && res.data.success === false) {
          setAuto(false);
          throw new Error( "No cards remaining!")
        }
        const card = res.data.cards[0];
        setCards(cards => [...cards, {image: card.image, code: card.code, angle: getAngle(), id: uuid()}]);
      } catch (err) {
        alert(err);
      }
    }
  
    if (auto && !intervalId.current) {
      intervalId.current = setInterval(async () => {
        await drawCard();
      }, 200);
    } 

    return () => {
      clearInterval(intervalId.current);
      intervalId.current = null;
    };
  },
  [auto, deck]);

  const start = () => {
    setAuto(!auto);
  }

  const renderCards = () => {
    return (
      cards.map(card => <Card image={card.image} code={card.code} angle={card.angle} key={card.id} />)
    )
  }

  const getAngle = () => (Math.floor(Math.random() * 90) - 45);

  return (
    <div className="Deck">
      <div className="Deck-top">
        {deck ? 
        <button onClick={start} className="Deck-btn">
          {auto ? "Stop Drawing" : "Start Drawing"}
        </button> : 
        <i>(loading)</i> }
      </div>
      <div className="Deck-main">
        {renderCards()}
      </div>
    </div>
  )
}

export default Deck;