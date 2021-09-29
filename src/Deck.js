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
      setDeck(res.data);
    }
    console.log("running first use effect");
    getDeck();
  }, []);

  useEffect(() => {
    async function drawCard() {
      try {
        const res = await axios.get(`${BASE_URL}/${deck.deck_id}/draw/?count=1`);
        setDeck({...deck, remaining: res.data.remaining});
        if (res.data.remaining === 0) {
          setAuto(false);
          throw new Error( "No cards remaining!")
        }
        const card = res.data.cards[0];
        setCards(cards => (
          [...cards, 
            {image: card.image, 
              code: card.code, 
              angle: getAngle(), 
              transX: getTransX(), 
              transY: getTransY(), 
              id: uuid()}
          ]
        ));
      } catch (err) {
        alert(err);
      }
    }

    console.log("running second use effect");
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
  [auto]);

  const start = () => {
    setAuto(!auto);
  }

  const renderCards = () => {
    return (
      cards.map(card => 
        <Card 
          image={card.image} 
          code={card.code} 
          angle={card.angle} 
          transX={card.transX} 
          transY={card.transY} 
          key={card.id} 
        />
      )
    )
  }

  const newDeck = () => {
    async function getDeck() {
      const res = await axios.get(`${BASE_URL}/new/shuffle/?deck_count=1`);
      setDeck(res.data);
    }
    getDeck();
    setCards([]);
  }

  const getAngle = () => (Math.floor(Math.random() * 90) - 45);
  const getTransX = () => (Math.floor(Math.random() * 40) - 20);
  const getTransY = () => (Math.floor(Math.random() * 40) - 20);


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
      {deck && deck.remaining === 0 ? <button className="Deck-btn" onClick={newDeck}>New deck</button> : null}
    </div>
  )
}

export default Deck;