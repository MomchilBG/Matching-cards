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
