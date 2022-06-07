//-----------------game object-----------------------
let game = {
  numOfPlayers: 0,
  playerOne: "",
  playerTwo: "",
  pipArray: [],
  opposites: {
    0: 12,
    1: 11,
    2: 10,
    3: 9,
    4: 8,
    5: 7,
    7: 5,
    8: 4,
    9: 3,
    10: 2,
    11: 1,
    12: 0,
  },
  currentPlayer: 0,
  winner: "",
};

//---------------Gathering Player info--------------

let next = document.querySelector("#next");
let chooseNumber = document.querySelector("#choose_number");
let readyToPlay = document.querySelector("#ready_to_play");
const nameForm = document.querySelector("form");
let player1Input;
let player2Input;

const enterNumber = document.querySelector("#enter_number");
const enterName = document.querySelector("#enter_name");
const displayTurn = document.querySelector("#vs");
const playerOneSide = document.querySelector("#player_one_side");
const playerOneMancala = document.querySelector("#player_one_mancala");
const playerTwoSide = document.querySelector("#player_two_side");
const playerTwoMancala = document.querySelector("#player_two_mancala");

function createInputs(num) {
  for (let i = num; i > 0; i--) {
    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("Placeholder", `Player ${i}`);
    input.setAttribute("id", `player_${i}_input`);
    nameForm.prepend(input);
  }

  player1Input = document.querySelector("#player_1_input");

  if (game.numOfPlayers === 2) {
    player2Input = document.querySelector("#player_2_input");
  }
}

next.addEventListener("click", () => {
  game.numOfPlayers = parseInt(chooseNumber.value);

  if (game.numOfPlayers === 1) {
    game.playerTwo = "Computer";
  }

  createInputs(game.numOfPlayers);

  enterNumber.style.display = "none";
  enterName.style.display = "block";
});

readyToPlay.addEventListener("click", (e) => {
  e.preventDefault();
  game.playerOne = player1Input.value;

  if (game.numOfPlayers === 2) {
    game.playerTwo = player2Input.value;
  }

  playerOneSide.innerText = `${game.playerOne}'s side`;
  playerOneMancala.innerText = `${game.playerOne}'s mancala`;
  playerTwoSide.innerText = `${game.playerTwo}'s side`;
  playerTwoMancala.innerText = `${game.playerTwo}'s mancala`;

  enterName.style.display = "none";
  displayTurn.style.display = "block";

  currentGame = buildInitialState();

  if (isComputer) {
    setTimeout(turn, 2000);
  }
});

//--------------build Initial state--------------

function buildInitialState() {
  game.pipArray = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];
  //game.pipArray = [1, 1, 1, 1, 1, 1, 5, 0, 0, 0, 0, 1, 1, 5]; //for testing purposes
  placePips();
  chooseBeginningPlayer();
  whoseTurn();
}

function chooseBeginningPlayer() {
  game.currentPlayer = Math.floor(Math.random() * 2) + 1;
}

function placePips() {
  //let delayTime = 200;
  game.pipArray.forEach((numOfPips, index) => {
    const box = document.querySelector(`[data-index="${index}"]`);
    box.innerHTML = "";

    for (let i = 0; i < numOfPips; i++) {
      let currentPip = document.createElement("div");
      currentPip.className = "pip";
      box.appendChild(currentPip);
    }

    if (box.classList.contains("addPip")) {
      let addedPip = box.lastElementChild;
      if (addedPip) {
        addedPip.style.opacity = "0";
        addedPip.style.transition = "opacity 1000ms";
        setTimeout(() => {
          addedPip.style.opacity = "1";
        }, 300); //delayTime);
        // delayTime += 200;
        // console.log(delayTime + " index " + index);
      }
      box.classList.remove("addPip");
    }
  });
}

function whoseTurn() {
  if (game.currentPlayer === 1) {
    displayTurn.innerText = `${game.playerOne}'s Turn`;
  } else {
    displayTurn.innerText = `${game.playerTwo}'s Turn`;
  }
}

//------------------Take a turn-----------------
const alertWindow = document.querySelector("#alert_wrapper");
const closeAlert = document.querySelector("#close_alert");
const alertMessage = document.querySelector("#message");

const winnerWindow = document.querySelector("#winner_window");
const announceWinner = document.querySelector("#winner");
const newGameReset = document.querySelector("#new_game_reset");
const closeModal = document.querySelector("#close_modal");

winnerWindow.style.display = "none";
alertWindow.style.display = "none";

const board = document.querySelector(".board");

board.addEventListener("click", (e) => {
  if (isValidPit(e)) {
    turn(e);
  }
});

function isValidPit(event) {
  if (isComputer()) {
    alertMessage.innerText = "It is not your turn.";
    alertWindow.style.display = "flex";
    return false;
  }

  if (event.target.classList.contains("mancala")) {
    alertMessage.innerText =
      "You cannot choose a mancala.  Please choose a pit.";
    alertWindow.style.display = "flex";
    return false;
  }

  if (game.currentPlayer != event.target.dataset.player) {
    alertMessage.innerText = "Choose a pit on your side.";
    alertWindow.style.display = "flex";
    return false;
  }

  let index = parseInt(event.target.dataset.index);

  if (game.pipArray[index] === 0) {
    alertMessage.innerText = "This pit is empty.  Please choose another.";
    alertWindow.style.display = "flex";
    return false;
  }

  return true;
}

function turn(event) {
  let index;
  let hand;

  if (isComputer()) {
    index = isValidComputerPit();
  } else {
    index = parseInt(event.target.dataset.index);
  }
  const firstBox = document.querySelector(`[data-index="${index}"]`);
  hand = game.pipArray[index];
  game.pipArray[index] = 0;

  let endIndex = movePips(hand, index);
  const box = document.querySelector(`[data-index="${endIndex}"]`);

  if (
    game.pipArray[endIndex] === 1 &&
    box.dataset.player == game.currentPlayer &&
    !box.classList.contains("mancala")
  ) {
    stealPips(endIndex);
  }

  fadePips(firstBox, placePips);

  if (isSideEmpty()) {
    gameOver(whoWins);
    return;
  }

  if (box.classList.contains("mancala")) {
    displayTurn.innerText = `You get another turn!`;
  } else {
    changePlayer();
  }

  if (isComputer()) {
    setTimeout(turn, 2000);
  }
}

function movePips(numOfPips, pitIndex) {
  let currentIndex;
  for (let i = 1; i <= numOfPips; i++) {
    currentIndex = (pitIndex + i) % 14;
    if (game.currentPlayer === 1 && currentIndex === 13) {
      numOfPips++;
      continue;
    } else if (game.currentPlayer === 2 && currentIndex === 6) {
      numOfPips++;
      continue;
    }
    game.pipArray[currentIndex]++;
    const box = document.querySelector(`[data-index="${currentIndex}"]`);
    box.classList.add("addPip");
  }

  return currentIndex;
}

function stealPips(index) {
  let oppositeIndex = game.opposites[index];
  let stealNumber = game.pipArray[oppositeIndex];
  let oppositeBox = document.querySelector(`[data-index="${oppositeIndex}"]`);
  //this could still use some work.
  setTimeout(() => {
    fadePips(oppositeBox, placePips);
  }, 1000);

  if (game.currentPlayer === 1) {
    game.pipArray[oppositeIndex] = 0;
    game.pipArray[6] += stealNumber;
  } else {
    game.pipArray[oppositeIndex] = 0;
    game.pipArray[13] += stealNumber;
  }
}

function fadePips(pit, callback) {
  let pips = [...pit.children];
  pips.forEach((pip) => {
    pip.style.opacity = 0;
  });

  setTimeout(callback, 1000);
}

function changePlayer() {
  if (game.currentPlayer === 1) {
    game.currentPlayer = 2;
  } else {
    game.currentPlayer = 1;
  }
  whoseTurn();
}

function isComputer() {
  if (game.currentPlayer === 2 && game.playerTwo === "Computer") {
    return true;
  } else {
    return false;
  }
}

function isValidComputerPit() {
  let validIndexes = [];

  for (i = 7; i < game.pipArray.length - 1; i++) {
    if (game.pipArray[i] != 0) {
      validIndexes.push(i);
    }
  }

  let random = Math.floor(Math.random() * validIndexes.length);
  let validPitIndex = validIndexes[random];

  return validPitIndex;
}

function isSideEmpty() {
  let sum1 = 0;
  let sum2 = 0;

  for (let i = 0; i < 6; i++) {
    sum1 += game.pipArray[i];
  }

  for (let i = 7; i < 13; i++) {
    sum2 += game.pipArray[i];
  }

  if (sum1 === 0 || sum2 === 0) {
    return true;
  } else {
    return false;
  }
}

function gameOver(callback) {
  let sum1 = 0;
  let sum2 = 0;

  for (let i = 0; i < game.pipArray.length; i++) {
    if (i < 7) {
      sum1 += game.pipArray[i];
      game.pipArray[i] = 0;
    } else {
      sum2 += game.pipArray[i];
      game.pipArray[i] = 0;
    }
  }

  game.pipArray[6] = sum1;
  game.pipArray[13] = sum2;

  placePips();
  setTimeout(callback, 1000);
}

function whoWins() {
  switch (true) {
    case game.pipArray[6] > game.pipArray[13]:
      game.winner = game.playerOne;
      break;
    case game.pipArray[6] < game.pipArray[13]:
      game.winner = game.playerTwo;
      break;
    default:
      announceWinner.innerText = "It's a tie!";
      winnerWindow.style.display = "flex";
      return;
  }

  announceWinner.innerText = `${game.winner} wins!`;
  winnerWindow.style.display = "flex";
}

//--------------------Button event listeners-----------------
closeAlert.addEventListener("click", () => {
  alertWindow.style.display = "none";
});

closeModal.addEventListener("click", () => {
  winnerWindow.style.display = "none";
});

const reset = document.querySelectorAll(".reset");

reset.forEach((button) => {
  button.addEventListener("click", () => {
    nameForm.innerHTML =
      '<input type="submit" value="Let\'s Play" id="ready_to_play" />';
    displayTurn.style.display = "none";
    enterName.style.display = "none";
    enterNumber.style.display = "block";

    playerOneSide.innerText = "";
    playerOneMancala.innerText = "";
    playerTwoSide.innerText = "";
    playerTwoMancala.innerText = "";

    game.pipArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    placePips();

    winnerWindow.style.display = "none";
  });
});
