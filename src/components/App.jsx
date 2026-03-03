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
  const [lastMatch, setLastMatch] = useState(null);
  const [lastFailedMatch, setLastFailedMatch] = useState(null);
  const [matches, setMatches] = useState(0);

  useEffect(() => {
    const fetchDeck = async () => {
      const newDeck = await getNewDeck();
      setDeckData({ deckId: newDeck.deck_id, remaining: newDeck.remaining });
      console.log(newDeck);
    };
    fetchDeck();
  }, []);

  const incrementMatches = () => {
    setMatches((prev) => prev + 1);
  };

  const calcMisses = () => {
    return 51 - deckData.remaining - matches < 0
      ? 0
      : 51 - deckData.remaining - matches;
  };

  return (
    <DeckContext.Provider value={{ ...deckData, setDeckData }}>
      <div className="App">
        <div id="left-panel" className="panel">
          <div id="match-count-display">
            <h2>{matches} matches</h2>
            <h2>
              {`${calcMisses()} `}
              misses
            </h2>
          </div>
          <Card card={lastFailedMatch} />
          <Card card={lastMatch} />
        </div>
        <div id="middle-panel" className="panel">
          <Card
            card={previousCard}
            setNextCard={
              previousCard?.isMatched ? setLastMatch : setLastFailedMatch
            }
          />
          <Card
            card={newCard}
            setNextCard={setPreviousCard}
            isNewCardField={true}
            incrementMatches={incrementMatches}
          />
        </div>
        <div id="right-panel" className="panel">
          <p>{`${52 - deckData.remaining} / 52`}</p>
          <Deck setNewCard={setNewCard} />
        </div>
      </div>
    </DeckContext.Provider>
  );
}

export default App;
