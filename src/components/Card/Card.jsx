import './Card.css';
import { useRef, useEffect } from 'react';

export default function Card({ card = null, setNextCard, isNewCardField = false }) {
  const previousCard = useRef(card);

  useEffect(() => {
    if (card && card !== previousCard.current) {
      if (previousCard.current) {
        setNextCard(previousCard.current);
      }
      if (
        isNewCardField &&
        previousCard.current &&
        (previousCard.current.suit === card.suit ||
          previousCard.current.value === card.value)
      ) {
        alert('Match found!');
      }
      previousCard.current = card;
    }
  }, [card, setNextCard, isNewCardField]);

  if (!card) {
    return <div className="Card">No card drawn yet.</div>;
  }
  return (
    <div className="Card">
      <img src={card.image} alt={`${card.value} of ${card.suit}`} />
    </div>
  );
}
