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
    emptyCell,
  };
})();

const Display = (() => {
  function renderBoard(boardState) {
    for (let i = 0; i < boardState.length; i += 1) {
      if (boardState[i] !== gameBoard.emptyCell) {
        document.getElementById(`${i}`).textContent = boardState[i];
      }
    }
  }

  function getPlayerMove() {
    const columns = document.querySelectorAll('.column');
    columns.forEach((column) => {
      column.addEventListener('click', (event) => {
        Gamemaster.playRound(event.target.id);
      });
    });
  }

  return { renderBoard, getPlayerMove };
})();

const Person = (playerName, playerSymbol) => {
  const name = playerName;
  const symbol = playerSymbol;
  let move;
  return { name, symbol, move };
};

const Gamemaster = (() => {
  const human = Person('Human', '🇨🇦');
  const computer = Person('Computer', '🇧🇷');

  function getFirstMove() {
    const firstMove = Math.round(Math.random());
    if (firstMove === 0) {
      human.move = 1;
      computer.move = 0;
    } else {
      human.move = 0;
      computer.move = 1;
    }
  }

  function setupGame() {
    gameBoard.newGameState();
    getFirstMove();
    Display.getPlayerMove();
  }

  function getRandomLegalMove() {
    return Math.floor(Math.random() * gameBoard.getLegalMoves().length);
  }

  function playRound(humanMove) {
    if (human.move === 1) {
      if (!gameBoard.makeMove(human.symbol, humanMove)) {
        return 'error: must be valid human move';
      }
      human.move = 0;
      computer.move = 1;
      Display.renderBoard(gameBoard.getBoardState());
      return playRound();
    }
    const computerMove = getRandomLegalMove();
    if (!gameBoard.makeMove(computer.symbol, computerMove)) {
      return 'error: must be valid computer move';
    }
    human.move = 1;
    computer.move = 0;
    Display.renderBoard(gameBoard.getBoardState());
    return 'successfully played computer move';
  }

  setupGame();
  return { playRound };
})();
