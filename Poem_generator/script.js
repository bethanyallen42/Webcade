function parseText(string) {
  return string
    .replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g, "")
    .replace(/\s{2,}/g, " ")
    .toLowerCase()
    .split(" ");
}

function markovChain(arr) {
  const dictionary = {};

  arr.forEach((item, index, arr) => {
    let nextWord = arr[index + 1];
    if (dictionary[item]) {
      if (nextWord) {
        dictionary[item].push(nextWord);
      }
    } else {
      if (nextWord) {
        dictionary[item] = [nextWord];
      } else {
        dictionary[item] = [];
      }
    }
  });

  return dictionary;
}

function generateWordPairs(string) {
  return markovChain(parseText(string));
}

function randomWord(arr) {
  let word = arr[Math.floor(Math.random() * arr.length)];
  return word;
}

function writeLine(obj, n) {
  let keysArray = Object.keys(obj);
  let word = randomWord(keysArray);
  let poetryLine = word;
  let nextChoice = obj[word];

  let count = 1;

  while (count < n) {
    if (nextChoice.length >= 1) {
      word = randomWord(nextChoice);
      poetryLine += " " + word;
      nextChoice = obj[word];
      count++;
    } else {
      word = randomWord(keysArray);
      nextChoice = obj[word];
    }
  }
  return poetryLine;
}

function generatePoem(wordCorpus, num) {
  let wordPairs = generateWordPairs(wordCorpus);
  let poem = [];

  for (let i = 0; i < num; i++) {
    poem.push(writeLine(wordPairs, Math.floor(Math.random() * 10) + 1));
  }

  return poem;
}

function format(arr) {
  let poem = "";
  arr.forEach((item) => {
    poem += item + "<br>";
  });
  return poem;
}

document.getElementById("poemCard").style.display = "none";

document.getElementById("submitBtn").onclick = function (e) {
  e.preventDefault();
  const text = document.getElementById("submittedCorpus").value;
  const lines = Number(document.getElementById("numOfLines").value);

  document.getElementById("generatedPoem").innerHTML = format(
    generatePoem(text, lines)
  );

  document.getElementById("questionCard").style.display = "none";
  document.getElementById("poemCard").style.display = "flex";
  window.scrollTo(0, 0);
};

document.getElementById("playAgain").onclick = function () {
  document.getElementById("poemCard").style.display = "none";
  document.getElementById("questionCard").style.display = "flex";
  document.getElementById("submissionForm").reset();
  window.scrollTo(0, 0);
};
