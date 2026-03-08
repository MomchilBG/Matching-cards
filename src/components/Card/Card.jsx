import './Card.css';
import { useRef, useEffect, useState } from 'react';
import React from 'react';

export default React.memo(function Card({
  card = null,
  setNextCard = () => {},
  setCardMatchedProperty = null,
}) {
  const [loading, setLoading] = useState(!!card);

  const previousCard = useRef(card);

  useEffect(() => {
    if (card && card !== previousCard.current) {
      if (previousCard.current) {
        if (setCardMatchedProperty) {
          setCardMatchedProperty(card, previousCard);
        } else {
          setNextCard(previousCard.current);
        }
      }
      previousCard.current = card;
    } else if (card === null) {
      previousCard.current = null;
    }
  }, [card, setNextCard, setCardMatchedProperty]);

  return (
    <div className="Card">
      {!card ? (
        <div className="card-placeholder" />
      ) : (
        <>
          <img
            key={card.image}
            src={card.image}
            alt={`${card.value} of ${card.suit}`}
            onLoad={() => setLoading(false)}
            style={{ visibility: loading ? 'hidden' : 'visible' }}
          />
        </>
      )}
    </div>
  );
});
