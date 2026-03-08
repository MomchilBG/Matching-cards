import './BetWindow.css';
import { useState } from 'react';

export default function BetWindow({
  closeWindow = () => {},
  score = 0,
  matchChanceRatio = 0,
  setBet = () => {},
  bet = 0,
}) {
  const [betAmount, setBetAmount] = useState(bet);
  const [error, setError] = useState(null);

  const totalPoints = score + bet;

  const validateBetInput = (e) => {
    const value = +e.target.value;
    if (typeof value !== 'number' || Number.isNaN(value)) {
      setError('Please enter a number');
      return;
    } else if (value < 0) {
      setError('Please enter a positive value');
      return;
    } else if (value > totalPoints) {
      setError('Insufficient score');
      return;
    } else if (value % 1 !== 0) {
      setError('Please enter a whole number');
      return;
    } else {
      setError(null);
      setBetAmount(value);
    }
  };

  const changeBetAmount = (amount) => {
    const input = document.getElementById('bet-amount');
    if (+input.value + amount >= 0 && +input.value + amount <= totalPoints) {
      input.value = +(input.value || 0) + amount;
      setBetAmount((prev) => prev + amount);
    } else if (+input.value + amount > totalPoints) {
      input.value = totalPoints;
      setBetAmount(totalPoints);
    }
  };

  const confirmBet = () => {
    setBet(betAmount);
    closeWindow();
  };

  return (
    <div id="BetWindow">
      <div id="bet-score-stats">
        <p>{`Score: ${totalPoints - betAmount}`}</p>
        <p>{`Benefit: ${matchChanceRatio > 0 ? (betAmount * (1 / matchChanceRatio)).toFixed(0) : betAmount}`}</p>
      </div>
      <div id="bet-settings">
        <button
          onClick={() => changeBetAmount(-100)}
          disabled={betAmount < 100}
        >
          -100
        </button>
        <button onClick={() => changeBetAmount(-50)} disabled={betAmount < 50}>
          -50
        </button>
        <div>
          <input
            type="text"
            id="bet-amount"
            placeholder="Score to bet"
            value={betAmount}
            onChange={validateBetInput}
          />
          <p className={`error-text ${!error && 'hidden'}`}>{`${error}`}</p>
        </div>
        <button
          onClick={() => changeBetAmount(50)}
          disabled={totalPoints - betAmount < 50}
        >
          +50
        </button>
        <button onClick={() => changeBetAmount(totalPoints)}>All in</button>
      </div>
      <div id="bet-window-navigation">
        <button onClick={closeWindow}>Cancel</button>
        <button onClick={confirmBet}>Confirm</button>
      </div>
    </div>
  );
}
