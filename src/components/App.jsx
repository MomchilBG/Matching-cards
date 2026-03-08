import './App.css';
import Deck from './Deck/Deck';
import Card from './Card/Card';
import BetWindow from './BetWindow/BetWindow';
import EndOfGame from './EndOfGame/EndOfGame';
import Modal from './Modal/Modal';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { getNewDeck, shuffleDeck } from '../api-services/deck-services';
import { DeckContext } from '../context/context';
import { scoreBoosts } from '../constants';

const { VALUE_MATCH, SUIT_MATCH } = scoreBoosts;

function App() {
  const [deckData, setDeckData] = useState({ deckId: null, remaining: null });
  const [newCard, setNewCard] = useState(null);
  const [previousCard, setPreviousCard] = useState(null);
  const [lastMatch, setLastMatch] = useState(null);
  const [lastFailedMatch, setLastFailedMatch] = useState(null);
  const [{ valueMatches, suitMatches }, setMatches] = useState({
    valueMatches: 0,
    suitMatches: 0,
  });
  const [typeOfMatch, setTypeOfMatch] = useState(null);
  const [drawnCards, setDrawnCards] = useState({});
  const [showBet, setShowBet] = useState(false);
  const [bet, setBet] = useState(0);
  const [score, setScore] = useState(0);

  const prevMatchChance = useRef(null);

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
    setMatches({ valueMatches: 0, suitMatches: 0 });
    setTypeOfMatch(null);
    setDrawnCards({});
    setBet(0);
    setScore(0);
  };

  const calcMisses = () =>
    51 - deckData.remaining - (suitMatches + valueMatches) < 0
      ? 0
      : 51 - deckData.remaining - (suitMatches + valueMatches);

  const sortDiscardedCards = useCallback((card) => {
    if (card.isMatched === true) {
      setLastMatch(card);
    } else if (card.isMatched === false) {
      setLastFailedMatch(card);
    }
  }, []);

  const calcMatchChance = useMemo(() => {
    if (newCard && deckData?.remaining) {
      const drawnFromSuit = drawnCards[newCard.suit] || 0;
      const drawnFromValue = drawnCards[newCard.value] || 0;
      const numOfMatchingCards = 13 - drawnFromSuit + 4 - drawnFromValue;

      return numOfMatchingCards / deckData.remaining;
    }
    return 1;
  }, [drawnCards, newCard, deckData.remaining]);

  const betWon = useCallback(
    (isWon) => {
      if (isWon) {
        setScore(
          (prev) =>
            prev + +(bet * (1 / prevMatchChance.current) - bet).toFixed(0),
        );
      } else {
        setScore((prev) => prev - bet);
      }
      setBet(0);
    },
    [bet],
  );

  const setCardMatchedProperty = useCallback(
    (card, previousCard) => {
      if (previousCard.current) {
        if (previousCard.current.suit === card.suit) {
          setTypeOfMatch('suit');
          setMatches((prev) => ({
            ...prev,
            suitMatches: prev.suitMatches + 1,
          }));
          setPreviousCard({ ...previousCard.current, isMatched: true });
          bet ? betWon(true) : setScore((prev) => prev + SUIT_MATCH);
        } else if (previousCard.current.value === card.value) {
          setTypeOfMatch('value');
          setMatches((prev) => ({
            ...prev,
            valueMatches: prev.valueMatches + 1,
          }));
          setPreviousCard({ ...previousCard.current, isMatched: true });
          bet ? betWon(true) : setScore((prev) => prev + VALUE_MATCH);
        } else {
          setPreviousCard({ ...previousCard.current, isMatched: false });
          setTypeOfMatch(null);
          betWon(false);
        }
      }
    },
    [betWon, bet],
  );

  const drawNewCard = useCallback(
    (card) => {
      setNewCard(card);
      setDrawnCards((drawnCards) => {
        return {
          ...drawnCards,
          [card.suit]: (drawnCards[card.suit] || 0) + 1,
          [card.value]: (drawnCards[card.value] || 0) + 1,
        };
      });
      if (calcMatchChance) {
        prevMatchChance.current = calcMatchChance;
      }
    },
    [calcMatchChance],
  );

  return (
    <DeckContext.Provider value={{ ...deckData, setDeckData }}>
      <div className="App">
        <div id="left-panel" className="panel">
          <div id="match-count-display">
            <h2>{valueMatches + suitMatches} matches</h2>
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
            <p>Score: {score - bet}</p>
            <p>Placed bet: {bet}</p>
            <button onClick={() => setShowBet(true)}>Bet</button>
          </div>
        </div>
        <div id="right-panel" className="panel">
          <p>{`Card ${52 - deckData.remaining} of 52`}</p>
          <Deck drawNewCard={drawNewCard} />
          <p>
            {newCard
              ? deckData.remaining > 0
                ? `${(100 * calcMatchChance).toFixed(1)}% match chance`
                : 'Thanks for playing!'
              : 'Draw a card'}
          </p>
        </div>
        {showBet && (
          <Modal>
            <BetWindow
              closeWindow={() => setShowBet(false)}
              score={score - bet}
              matchChanceRatio={calcMatchChance}
              setBet={setBet}
              bet={bet}
            />
          </Modal>
        )}
        {deckData.remaining === 0 && (
          <Modal>
            <EndOfGame
              closeWindow={restartGame}
              score={score}
              suitMatches={suitMatches}
              valueMatches={valueMatches}
            />
          </Modal>
        )}
      </div>
    </DeckContext.Provider>
  );
}

export default App;
