import './Card.css';
import { useRef, useEffect, useState } from 'react';
import React from 'react';

export default React.memo(function Card({
  card = null,
  setNextCard = () => {},
  setMatchValue = null,
}) {
  const [loading, setLoading] = useState(true);

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
    } else if (card === null) {
      previousCard.current = null;
    }
  }, [card, setNextCard, setMatchValue]);

  return (
    <div className="Card">
      {card ? (
        <img
          onLoad={() => setLoading(false)}
          src={card.image}
          alt={`${card.value} of ${card.suit}`}
          style={{ visibility: loading ? 'hidden' : 'visible' }}
        />
      ) : (
        <div className="card-placeholder" />
      )}
    </div>
  );
});
