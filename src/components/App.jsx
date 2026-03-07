import './App.css';
import Deck from './Deck/Deck';
import Card from './Card/Card';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { getNewDeck, shuffleDeck } from '../api-services/deck-services';
import { DeckContext } from '../context/context';

function App() {
  const [deckData, setDeckData] = useState({ deckId: null, remaining: null });
  const [newCard, setNewCard] = useState(null);
  const [previousCard, setPreviousCard] = useState(null);
  const [lastMatch, setLastMatch] = useState(null);
  const [lastFailedMatch, setLastFailedMatch] = useState(null);
  const [matches, setMatches] = useState(0);
  const [typeOfMatch, setTypeOfMatch] = useState(null);
  const [drawnCards, setDrawnCards] = useState({});

  useEffect(() => {
    const fetchDeck = async () => {
      const newDeck = await getNewDeck();
      setDeckData({ deckId: newDeck.deck_id, remaining: newDeck.remaining });
    };
    fetchDeck();
  }, []);

  const restartGame = async () => {
    const shuffled = await shuffleDeck(deckData.deckId);
    setDeckData({ ...deckData, remaining: shuffled.remaining });
    setNewCard(null);
    setPreviousCard(null);
    setLastMatch(null);
    setLastFailedMatch(null);
    setMatches(0);
    setTypeOfMatch(null);
    setDrawnCards({});
  };

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

  const setCardMatchedProperty = useCallback((card, previousCard) => {
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

  const drawNewCard = (card) => {
    setNewCard(card);
    setDrawnCards((drawnCards) => {
      return {
        ...drawnCards,
        [card.suit]: drawnCards[card.suit] + 1 || 1,
        [card.value]: drawnCards[card.value] + 1 || 1,
      };
    });
  };

  const calcMatchChance = useMemo(() => {
    if (newCard && deckData) {
      const drawnFromSuit = drawnCards[newCard.suit] || 0;
      const drawnFromValue = drawnCards[newCard.value] || 0;
      return deckData.remaining / (13 - drawnFromSuit + 4 - drawnFromValue);
    }
    return 1;
  }, [drawnCards, newCard, deckData]);

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
            <button onClick={restartGame}>Restart Game</button>
          </div>
          <div id="match-area">
            <p
              className={`snap-text ${!typeOfMatch && 'hidden'}`}
            >{`Snap ${typeOfMatch}!`}</p>
            <div id="comparing-cards">
              <Card card={previousCard} setNextCard={sortDiscardedCards} />
              <Card
                card={newCard}
                setCardMatchedProperty={setCardMatchedProperty}
              />
            </div>
          </div>
          <div id="bottom-bar">
            <p>Score: {100 * matches}</p>
            <button>Bet</button>
          </div>
        </div>
        <div id="right-panel" className="panel">
          <p>{`Card ${52 - deckData.remaining} of 52`}</p>
          <Deck drawNewCard={drawNewCard} />
          <p>
            {newCard
              ? deckData.remaining > 0
                ? `${(100 / calcMatchChance).toFixed(1)}% match chance`
                : 'Thanks for playing!'
              : 'Draw a card'}
          </p>
        </div>
      </div>
    </DeckContext.Provider>
  );
}

export default App;
