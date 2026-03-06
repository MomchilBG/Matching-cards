import './App.css';
import Deck from './Deck/Deck';
import Card from './Card/Card';
import { useEffect, useState, useCallback } from 'react';
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

  const calcMisses = () =>
    51 - deckData.remaining - matches < 0
      ? 0
      : 51 - deckData.remaining - matches;

  const sortDiscardedCards = useCallback((card) => {
    if (card.isMatched === true) {
      setLastMatch(card);
    } else if (card.isMatched === false) {
      setLastFailedMatch(card);
    }
  }, []);

  const setMatchValue = useCallback((card, previousCard) => {
    if (
      previousCard.current &&
      (previousCard.current.suit === card.suit ||
        previousCard.current.value === card.value)
    ) {
      setPreviousCard({ ...previousCard.current, isMatched: true });
      setMatches((prev) => prev + 1);
    } else if (previousCard.current) {
      setPreviousCard({ ...previousCard.current, isMatched: false });
    }
  }, []);

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
          <Card card={previousCard} setNextCard={sortDiscardedCards} />
          <Card card={newCard} setMatchValue={setMatchValue} />
        </div>
        <div id="right-panel" className="panel">
          <p>{`Card ${52 - deckData.remaining} of 52`}</p>
          <Deck setNewCard={setNewCard} />
        </div>
      </div>
    </DeckContext.Provider>
  );
}

export default App;
