import './Deck.css';
import { DeckContext } from '../../context/context';
import { useContext } from 'react';
import { drawNextCard } from '../../api-services/card-services.js';

export default function Deck({ setNewCard }) {
  const { deckId, remaining, setDeckData } = useContext(DeckContext);

  const handleDrawCard = async () => {
    if (!deckId) {
      console.error('No deck ID available to draw a card.');
      return;
    }
    try {
      const response = await drawNextCard(deckId);
      console.log('Card drawn:', response);
      setDeckData((prev) => ({ ...prev, remaining: response.remaining }));
      setNewCard(response.cards[0]);
    } catch (error) {
      console.error('Error drawing card:', error);
    }
  };

  return (
    <div className="Deck">
      <p>{`${52 - remaining} / 52`}</p>
      <button onClick={handleDrawCard}>
        <img
          src="https://deckofcardsapi.com/static/img/back.png"
          alt="back-of-card"
        />
      </button>
    </div>
  );
}
