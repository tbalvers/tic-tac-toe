const gameBoard = (() => {
  // eslint-disable-next-line prefer-const
  let gameArray = ['x', 'x', 'x', 'vacant', 'vacant', 'vacant', 'x', 'x', 'x'];
  const columns = 3;
  const rows = 3;
  const emptyCell = 'vacant';

  function newGameState() {
    const gameArrayLength = gameArray.length;
    for (let i = 0; i < gameArrayLength; i += 1) {
      gameArray.splice(0, 1);
    }
    for (let k = 0; k < rows * columns; k += 1) {
      gameArray.push(emptyCell);
    }
  }

  function getLegalMoves() {
    const legalMoves = [];
    const element = emptyCell;
    let index = gameArray.indexOf(element);
    while (index !== -1) {
      legalMoves.push(index);
      index = gameArray.indexOf(element, index + 1);
    }
    return legalMoves;
  }

  function makeMove(symbol, gridLocation) {
    if (getLegalMoves().includes(gridLocation)) {
      gameArray[gridLocation] = symbol;
      return true;
    }
    return false;
  }

  function getBoardState() {
    return gameArray;
  }

  return {
    newGameState,
    getLegalMoves,
    makeMove,
    getBoardState,
  };
})();

const Display = () => {
  displayBoard = document.querySelector;
};
