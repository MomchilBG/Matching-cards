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
  const [typeOfMatch, setTypeOfMatch] = useState(null);

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
    if (previousCard.current) {
      if (previousCard.current.suit === card.suit) {
        setTypeOfMatch('suit');
        setMatches((prev) => prev + 1);
        setPreviousCard({ ...previousCard.current, isMatched: true });
      } else if (previousCard.current.value === card.value) {
        setTypeOfMatch('value');
        setMatches((prev) => prev + 1);
        setPreviousCard({ ...previousCard.current, isMatched: true });
      } else {
        setPreviousCard({ ...previousCard.current, isMatched: false });
        setTypeOfMatch(null);
      }
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
          <div id="top-bar">
            <button>Reset Game</button>
          </div>
          <div id="match-area">
            <p
              className={`snap-text ${typeOfMatch ? 'visible' : 'hidden'}`}
            >{`Snap ${typeOfMatch}!`}</p>
            <div id="comparing-cards">
              <Card card={previousCard} setNextCard={sortDiscardedCards} />
              <Card card={newCard} setMatchValue={setMatchValue} />
            </div>
          </div>
          <div id="bottom-bar">
            <p>Score: {100 * matches}</p>
            <button>Bet</button>
          </div>
        </div>
        <div id="right-panel" className="panel">
          <p>{`Card ${52 - deckData.remaining} of 52`}</p>
          <Deck setNewCard={setNewCard} />
          <p>{newCard ? `67% match chance` : 'Draw a card'}</p>
        </div>
      </div>
    </DeckContext.Provider>
  );
}

export default App;
