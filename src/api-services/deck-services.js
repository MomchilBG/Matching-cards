export const getNewDeck = async () => {
  try {
    const newDeck = await fetch(
      'https://deckofcardsapi.com/api/deck/new/shuffle',
    ).then((data) => data.json());
    if (newDeck.error) throw new Error(newDeck.error);
    return newDeck;
  } catch (error) {
    console.error('Error getting a new deck: ', error);
  }
};

export const shuffleDeck = async (deck_id) => {
  try {
    const shuffled = await fetch(
      `https://deckofcardsapi.com/api/deck/${deck_id}/shuffle/`,
    ).then((data) => data.json());
    if (shuffled.error) throw new Error(shuffled.error);
    return shuffled;
  } catch (error) {
    console.error('Error shuffling deck: ', error);
  }
};
