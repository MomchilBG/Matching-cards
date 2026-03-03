import './App.css';
import Deck from './Deck/Deck';
import { useEffect, useState } from 'react';
import { getNewDeck } from '../api-services/deck-services';
import { DeckContext } from '../context/context';

function App() {
  const [deckData, setDeckData] = useState({ deckId: null, remaining: null });
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
        <Deck />
      </div>
    </DeckContext.Provider>
  );
}

export default App;
