import './BetWindow.css';
import { useState } from 'react';

export default function BetWindow({
  closeWindow = () => {},
  score = 0,
  matchChanceRatio = 0,
  setBet = () => {},
}) {
  const [betAmount, setBetAmount] = useState(0);
  const [error, setError] = useState(null);

  const validateBetInput = (e) => {
    const value = e.target.value;
    setBetAmount(0);
    if (typeof +value !== 'number' || Number.isNaN(+value)) {
      setError('Please enter a number');
      return;
    } else if (+value < 0) {
      setError('Please enter a positive value');
      return;
    } else if (+value > score) {
      setError('Insufficient score');
      return;
    } else {
      setError(null);
      setBetAmount(+value);
    }
  };

  const allIn = () => {
    const input = document.getElementById('bet-amount');
    input.value = score;
    setBetAmount(score);
  };

  const confirmBet = () => {
    setBet((prev) => prev + betAmount);
    closeWindow();
  };

  return (
    <div id="BetWindow">
      <p>{`${score - betAmount} score`}</p>
      <p>{`Benefit: ${(betAmount * matchChanceRatio).toFixed(0)}`}</p>
      <input
        type="text"
        id="bet-amount"
        placeholder="Score to bet"
        onChange={validateBetInput}
      />
      <p className={`error-text ${!error && 'hidden'}`}>{error}</p>
      <button onClick={closeWindow}>Cancel</button>
      <button onClick={confirmBet}>Confirm</button>
      <button onClick={allIn}>All in</button>
    </div>
  );
}
