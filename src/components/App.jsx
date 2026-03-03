import './App.css';
import Deck from './Deck/Deck';
import Card from './Card/Card';
import { useEffect, useState } from 'react';
import { getNewDeck } from '../api-services/deck-services';
import { DeckContext } from '../context/context';

function App() {
  const [deckData, setDeckData] = useState({ deckId: null, remaining: null });
  const [newCard, setNewCard] = useState(null);
  const [previousCard, setPreviousCard] = useState(null);

  useEffect(() => {
    const fetchDeck = async () => {
      const newDeck = await getNewDeck();
      setDeckData({ deckId: newDeck.deck_id, remaining: newDeck.remaining });
      console.log(newDeck);
    };
    fetchDeck();
  }, []);

  return (
    <DeckContext.Provider value={{ ...deckData, setDeckData }}>
      <div className="App">
        <Card card={previousCard} setNextCard={() => {}} />
        <Card
          card={newCard}
          setNextCard={setPreviousCard}
          isNewCardField={true}
        />
        <Deck setNewCard={setNewCard} />
      </div>
    </DeckContext.Provider>
  );
}

export default App;
