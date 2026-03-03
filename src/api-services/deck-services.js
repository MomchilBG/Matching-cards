export const getNewDeck = async () => {
  try {
    const newDeck = await fetch(
      'https://deckofcardsapi.com/api/deck/new/shuffle',
    );
    return newDeck.json();
  } catch (error) {
    console.error('Error getting a new deck: ', error);
  }
};
