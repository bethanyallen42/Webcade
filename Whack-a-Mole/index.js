let score = 0;

let holes = document.getElementsByClassName("hole");

setInterval(() => {
  holes[Math.floor(Math.random() * 9)].classList.toggle("mole");
}, 1000);

const gameArea = document.getElementById("whack-a-mole");
const scoreDisplay = document.getElementById("score");
gameArea.addEventListener("click", (e) => {
  if (e.target.matches(".mole")) {
    score++;
    e.target.classList.remove("mole");
    scoreDisplay.innerText = score;
  }
});
