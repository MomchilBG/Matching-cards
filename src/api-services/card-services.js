export const drawNextCard = async (deckID) => {
  try {
    const nextCard = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`,
    );
    return nextCard.json();
  } catch (error) {
    console.error('Error drawing next card: ', error);
  }
};
