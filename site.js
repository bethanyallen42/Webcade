const title = document.querySelector("h1");
const buttons = document.querySelectorAll("button");
const gameContainer = document.querySelector(".gameContainer");

let colorArray = [
  "#ED0003",
  "#FF8600",
  "#FFFE37",
  "#01FE01",
  "#3500FF",
  "#8C00FC",
];

let index = 1;
let hoverIndex = 0;

function changeColors() {
  let currentColor = colorArray[index];
  title.style.color = currentColor;
  index++;
  if (index > colorArray.length - 1) {
    index = 0;
  }
}

function changeButtonBackground(element) {
  let currentColor = colorArray[hoverIndex];
  element.style.backgroundColor = currentColor;
  hoverIndex++;
  if (hoverIndex > colorArray.length - 1) {
    hoverIndex = 0;
  }
}

setInterval(changeColors, 300);

buttons.forEach((button) => {
  button.addEventListener("mouseover", () => {
    changeButtonBackground(button);
  });

  button.addEventListener("mouseout", () => {
    button.style.backgroundColor = "#f5f5f5";
  });
});
