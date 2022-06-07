let currentGame = newGame();
let numbers = [...Array(101).keys()];
numbers.shift();

function generateWinningNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function shuffle(array, numOfShuffles = array.length) {
  let remainingLength = array.length;
  let idx;
  let endOfRemaining = array[remainingLength];
  let randomElement;

  for (let i = 0; i < numOfShuffles; i++) {
    idx = Math.floor(Math.random() * remainingLength--);
    randomElement = array[idx];
    endOfRemaining = array[remainingLength];
    array[remainingLength] = array[idx];
    array[idx] = endOfRemaining;
  }

  return array;
}

function gettingHotterOrColder(num, obj) {
  switch (true) {
    case num < 10:
      obj.message = `You're burning up!`;
      break;
    case num < 25:
      obj.message = `You're lukewarm`;
      break;
    case num < 50:
      obj.message = `You're a bit chilly`;
      break;
    default:
      console.log(typeof num);
      obj.message = `You're ice cold!`;
  }
}

function newGame() {
  let game = {
    winningNumber: generateWinningNumber(),
    playersGuess: "",
    pastGuesses: [],
  };

  game.difference = () => {
    return Math.abs(game.winningNumber - game.playersGuess);
  };

  game.isLower = () => {
    if (game.playersGuess < game.winningNumber) {
      return true;
    }
    return false;
  };

  game.playersGuessSubmission = (num) => {
    let number = parseInt(num);

    if (number < 1 || number > 100 || isNaN(number)) {
      let result = {
        message: "That is an invalid guess.",
        instructions: "Guess a number between 1-100",
      };
      return result;
    } else {
      game.playersGuess = number;
      return game.checkGuess();
    }
  };

  game.checkGuess = () => {
    let result = {};
    let difference = game.difference();
    if (game.playersGuess === game.winningNumber) {
      result.message = `You Win! The winning number was ${game.winningNumber}.`;
      result.instructions = "RESET THE GAME to play again!";

      return result;
    } else if (game.pastGuesses.indexOf(game.playersGuess) === -1) {
      game.pastGuesses.push(game.playersGuess);

      if (game.pastGuesses.length === 5) {
        result.message = `You Lose. The winning number was ${game.winningNumber}.`;
        result.instructions = "RESET THE GAME to play again!";

        return result;
      }

      if (game.isLower()) {
        result.instructions = "Guess Higher!";

        // game.difference() < 10
        //   ? (result.message = `You're burning up!`)
        //   : game.difference() < 25
        //   ? (result.message = `You're lukewarm.`)
        //   : game.difference() < 50
        //   ? (result.message = `You're a bit chilly.`)
        //   : (result.message = `You're ice cold!`);
        gettingHotterOrColder(difference, result);

        return result;
      } else {
        result.instructions = "Guess Lower!";

        // game.difference() < 10
        //   ? (result.message = `You're burning up!`)
        //   : game.difference() < 25
        //   ? (result.message = `You're lukewarm.`)
        //   : game.difference() < 50
        //   ? (result.message = `You're a bit chilly.`)
        //   : (result.message = `You're ice cold!`);

        gettingHotterOrColder(difference, result);

        return result;
      }
    } else {
      result.message = "You've already guessed that!";
      return result;
    }
  };

  game.newGame = () => {
    currentGame = newGame();
  };

  game.provideHint = (array) => {
    let hintArray = [game.winningNumber];

    let idxOfWinningNumber = array.indexOf(game.winningNumber);

    array.splice(idxOfWinningNumber, 1);

    let shuffledArray = shuffle(array, 2);

    hintArray.push(
      shuffledArray[shuffledArray.length - 1],
      shuffledArray[shuffledArray.length - 2]
    );

    let shuffledHintArray = shuffle(hintArray, 3);

    return shuffledHintArray;
  };

  return game;
}

function assignBoxes(array) {
  let boxes = document.querySelectorAll("li");

  for (let i = 0; i < array.length; i++) {
    let currentBox = boxes[i];
    currentBox.innerText = array[i];
  }
}

function clearBoxes() {
  let boxes = document.querySelectorAll("li");

  for (let i = 0; i < boxes.length; i++) {
    let currentBox = boxes[i];
    currentBox.innerText = "-";
  }
}

let heading = document.querySelector("h1");
let subHeading = document.querySelector("p");

let writeGuess = document.querySelector("#players_guess");
let makeGuess = document.querySelector("#submit_btn");

makeGuess.addEventListener("click", (e) => {
  e.preventDefault();
  let response = currentGame.playersGuessSubmission(writeGuess.value);
  heading.innerText = response.message;

  if (response.hasOwnProperty("instructions")) {
    subHeading.innerText = response.instructions;
  }

  assignBoxes(currentGame.pastGuesses);

  writeGuess.value = "";
});

let getHint = document.querySelector("#hint_btn");
getHint.addEventListener("click", () => {
  let hintArray = currentGame.provideHint(numbers);
  heading.innerText = `The winning number is either ${hintArray[0]}, ${hintArray[1]}, or ${hintArray[2]}.`;
});

let resetTheGame = document.querySelector("#play_again_btn");
resetTheGame.addEventListener("click", () => {
  currentGame.newGame();
  heading.innerText = "THE GUESSING GAME";
  subHeading.innerText = "Guess a number between 1-100";
  clearBoxes();
});
