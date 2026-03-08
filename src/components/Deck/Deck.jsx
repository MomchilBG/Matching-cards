import './Deck.css';
import { DeckContext } from '../../context/context';
import { useContext, useState } from 'react';
import { drawNextCard } from '../../api-services/card-services.js';
import React from 'react';

export default React.memo(function Deck({ drawNewCard = () => {} }) {
  const { deckId, remaining, setDeckData } = useContext(DeckContext);

  const [isDrawing, setIsDrawing] = useState(false);

  const handleDrawCard = async () => {
    if (isDrawing) return;

    setIsDrawing(true);
    if (!deckId) {
      console.error('No deck ID available to draw a card.');
      return;
    }
    if (remaining === 0) {
      return;
    }
    try {
      const response = await drawNextCard(deckId);
      if (response) {
        setDeckData((prev) => ({ ...prev, remaining: response.remaining }));
        drawNewCard(response.cards[0]);
      } else {
        return;
      }
    } catch (error) {
      console.error('Error drawing card:', error);
    }
    setIsDrawing(false);
  };

  return (
    <div className="Deck">
      {remaining === 0 ? (
        <div className="card-placeholder" />
      ) : (
        <button onClick={handleDrawCard}>
          <img
            src="https://deckofcardsapi.com/static/img/back.png"
            alt="back-of-card"
          />
        </button>
      )}
    </div>
  );
});
