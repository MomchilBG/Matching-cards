import './Card.css';
import { useRef, useEffect } from 'react';

export default function Card({
  card = null,
  setNextCard = () => {},
  isNewCardField = false,
  incrementMatches = () => {},
}) {
  const previousCard = useRef(card);

  useEffect(() => {
    if (card && card !== previousCard.current) {
      if (
        previousCard.current &&
        (previousCard.current.suit === card.suit ||
          previousCard.current.value === card.value)
      ) {
        if (isNewCardField) {
          setNextCard({ ...previousCard.current, isMatched: true });
          incrementMatches();
        } else {
          setNextCard(previousCard.current);
        }
      } else if (previousCard.current) {
        if (isNewCardField) {
          setNextCard({ ...previousCard.current, isMatched: false });
        } else {
          setNextCard(previousCard.current);
        }
      }
      previousCard.current = card;
    }
  }, [card, setNextCard, isNewCardField, incrementMatches]);

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
}