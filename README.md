# Snap!

A project that demonstrates using the Deck of Cards API (https://deckofcardsapi.com/) and displaying information from it using React, JavaScript, CSS and HTML

## Running the project

To run it, simply run the command `npm i`, followed by running `npm run dev` in the terminal.

## Playing the game

When you open [Snap!](https://cards-snap.netlify.app/), you are greeted with a board, where on the left section you have counters for matches and mismatches. Under them there are two discard piles - one for the misses and one for the matches. On the right section you'll see a counter saying how many cards have been drawn, the deck the cards are drawn from and the chance that the next drawn card is going to match the newly drawn one. In the middle section is where the game really happens - the left slot is where the previously drawn card sits and the right is where the newly drawn one is. Above them is a restart button and on the bottom is where score and placed bets are kept track of, while beside them sits a button allowing you to bet that the next card will be a match. If you click on said button, a screen will pop up, allowing you to place an amount of your score as a bet and see how much of a benefit you'll receive from a win.

The game is played until all the cards have been drawn. At the end of the game, you are shown your final score, the total amount of matches, the amount of suit matches and the amount of value matches, as well as the score you have earned from them respectively.
