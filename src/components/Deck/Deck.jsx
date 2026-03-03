import './Deck.css';
import { DeckContext } from '../../context/context';
import { useContext } from 'react';
import { drawNextCard } from '../../api-services/card-services.js';

export default function Deck() {
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
    } catch (error) {
      console.error('Error drawing card:', error);
    }
  };

  return (
    <div className="Deck">
      <h2>Deck Component</h2>
      <p>Deck ID: {deckId}</p>
      <p>Remaining Cards: {remaining}</p>
      <button onClick={handleDrawCard}>Draw Card</button>
    </div>
  );
}
