/* eslint-disable operator-linebreak */
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
    if (getLegalMoves().includes(Number(gridLocation))) {
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

  function printResult(gameResult) {
    const result = document.querySelector('#result');
    result.textContent = gameResult;
  }

  return { renderBoard, getPlayerMove, printResult };
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
      playRound();
    }
  }

  function setupGame() {
    gameBoard.newGameState();
    getFirstMove();
    Display.getPlayerMove();
  }

  function assessWin() {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [2, 4, 6],
      [0, 4, 8],
    ];

    let winner = 'none';

    winConditions.forEach((condition) => {
      if (
        gameBoard.getBoardState()[[condition[0]]] === human.symbol &&
        gameBoard.getBoardState()[[condition[1]]] === human.symbol &&
        gameBoard.getBoardState()[[condition[2]]] === human.symbol
      ) {
        Display.renderBoard(gameBoard.getBoardState());
        Display.printResult('Human wins!');
        winner = 'human';
      }
      if (
        gameBoard.getBoardState()[[condition[0]]] === computer.symbol &&
        gameBoard.getBoardState()[[condition[1]]] === computer.symbol &&
        gameBoard.getBoardState()[[condition[2]]] === computer.symbol
      ) {
        Display.renderBoard(gameBoard.getBoardState());
        Display.printResult('Computer wins!');
        winner = 'computer';
      }
    });
    return winner;
  }

  function assessTie() {
    if (gameBoard.getLegalMoves().length === 0) Display.printResult('Tie!');
  }

  function getRandomLegalMove() {
    return Math.floor(Math.random() * gameBoard.getLegalMoves().length);
  }

  function playRound(humanMove) {
    if (human.move === 1) {
      if (assessWin() !== 'none') {
        return 'game over';
      }
      if (!gameBoard.makeMove(human.symbol, humanMove)) {
        return 'error: must be valid human move';
      }
      human.move = 0;
      computer.move = 1;
      Display.renderBoard(gameBoard.getBoardState());
      if (assessWin() === 'none') {
        assessTie();
        return playRound();
      }
    }
    const computerMove = gameBoard.getLegalMoves()[getRandomLegalMove()];
    if (assessWin() !== 'none') {
      return 'game over';
    }
    if (!gameBoard.makeMove(computer.symbol, computerMove)) {
      return 'error: must be valid computer move';
    }
    human.move = 1;
    computer.move = 0;
    Display.renderBoard(gameBoard.getBoardState());
    if (assessWin() === 'none') {
      assessTie();
      return playRound();
    }
    return 'successfully played computer move';
  }

  setupGame();

  return {
    playRound,
    human,
    computer,
  };
})();
