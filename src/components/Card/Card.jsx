import './Card.css';
import { useRef, useEffect } from 'react';
import React from 'react';

export default React.memo(function Card({
  card = null,
  setNextCard = () => {},
  setMatchValue = null,
}) {
  const previousCard = useRef(card);

  useEffect(() => {
    if (card && card !== previousCard.current) {
      if (previousCard.current) {
        if (setMatchValue) {
          setMatchValue(card, previousCard);
        } else {
          setNextCard(previousCard.current);
        }
      }
      previousCard.current = card;
    }
  }, [card, setNextCard, setMatchValue]);

  if (!card) {
    return (
      <div className="Card">
        <div className="card-placeholder" />
      </div>
    );
  }
  return (
    <div className="Card">
      <img src={card.image} alt={`${card.value} of ${card.suit}`} />
    </div>
  );
});
