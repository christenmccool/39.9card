import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import "./Deck.css"
import Card from "./Card"
import { v4 as uuid } from 'uuid';

const BASE_URL = "http://deckofcardsapi.com/api/deck/";

const Deck = () => {
  // const deck_id = useRef();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    async function getDeck() {
      const res = await axios.get(`${BASE_URL}/new/shuffle/?deck_count=1`);
      setDeck(res.data.deck_id);
    }
    getDeck();
  }, []);

  const drawCard = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/${deck}/draw/?count=1`);
      const card = res.data.cards[0];
      setCards([...cards, {image: card.image, code: card.code, angle: getAngle(), id: uuid()}]);
    } catch (err) {
      alert("Error: no cards remaining!");
    }
  }

  const getAngle = () => (Math.floor(Math.random() * 90) - 45);

  const renderCards = () => {
    return (
      cards.map(card => <Card image={card.image} code={card.code} angle={card.angle} key={card.id} />)
    )
  }

  return (
    <div className="Deck">
      <div className="Deck-top">
        {deck ? <button onClick={drawCard} className="Deck-btn">Pick a card</button> : <i>(loading)</i> }
      </div>
      <div className="Deck-main">
        {renderCards()}
      </div>
    </div>
  )
}

export default Deck;