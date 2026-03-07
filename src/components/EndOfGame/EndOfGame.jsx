import './EndOfGame.css';
import { scoreBoosts } from '../../constants';

export default function EndOfGame({
  closeWindow,
  score,
  suitMatches,
  valueMatches,
}) {
  return (
    <div id="EndOfGame">
      <h1>Snap!</h1>
      <hr />
      <div className="final-stat">
        <p>Final score:</p> <p className="stat-value">{score}</p>
      </div>
      <div className="final-stat">
        <p>Total matches:</p>
        <p className="stat-value">{suitMatches + valueMatches}</p>
      </div>
      <div className="match">
        <p>Suit matches:</p>
        <p className="stat-value">{`${suitMatches} (${suitMatches * scoreBoosts.SUIT_MATCH} score)`}</p>
      </div>
      <div className="match">
        <p>Value matches:</p>
        <p className="stat-value">{`${valueMatches} (${valueMatches * scoreBoosts.VALUE_MATCH} score)`}</p>
      </div>
      <hr />
      <button onClick={closeWindow}>New Game</button>
    </div>
  );
}
