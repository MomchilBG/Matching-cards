export const drawNextCard = async (deckID) => {
  try {
    const nextCard = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`,
    ).then((data) => data.json());
    if (nextCard.error) throw new Error(nextCard.error);
    return nextCard;
  } catch (error) {
    console.error('Error drawing next card: ', error);
  }
};
