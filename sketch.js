function createMatrix(cols2, rows2) {
  let arr = new Array(cols2);
  for (let i = 0; i < cols2; i++) {
    arr[i] = new Array(rows2);
    for (let j = 0; j < rows2; j++) {
      arr[i][j] = 0;
    }
  }
  return arr;
}
let hue = 0;
let brushSize = 5;
const cols = 50;
const rows = 50;
let delay = 20;
let arr = createMatrix(cols, rows);
function setup() {
  createCanvas(400, 400);
  colorMode(HSL);
}

function draw() {
  //draw the array
  let squareSize = width / cols;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (arr[i][j] > 0) {
        fill(arr[i][j], 100, 50);
      } else {
        fill("black");
      }
      square(i * squareSize, j * squareSize, squareSize);
    }
  }

  //mouse (prevent spilling and stay inside square)
  mouseCol = Math.max(Math.min(Math.floor(mouseX / squareSize), cols - 1), 0);
  mouseRow = Math.max(Math.min(Math.floor(mouseY / squareSize), rows - 1), 0);
  fill("gray");
  square(mouseCol * squareSize, mouseRow * squareSize, squareSize);

  hue += 1;
  if (hue == 360) {
    hue = 1;
  }

  if (mouse1 == true) {
    if (!document.querySelector("#usr-chk").checked) {
      //arr[mouseCol][mouseRow] = document.getElementById("usr-clr").value * 3.6;
      let matrix = brushSize;
      let extent = floor(matrix / 2);
      for (let i = -extent; i <= extent; i++) {
        for (let j = -extent; j <= extent; j++) {
          if (random(1) < 0.75) {
            let col = mouseCol + i;
            let row = mouseRow + j;
            if (withinCols(col) && withinRows(row)) {
              if (document.getElementById("rainbow").checked) {
                arr[col][row] = hue;
              } else {
                arr[col][row] = document.getElementById("usr-clr").value * 3.6;
              }
            }
          }
        }
      }
    } else {
      arr[mouseCol][mouseRow] = 400;
    }
  }
  //coords
  fill("white");
  text(`X: ${mouseCol}, Y: ${mouseRow}`, 0, 10);
}

//update pixels function
let updateLoop;
function startLoop() {
  updateLoop = window.setInterval(() => {
    //create a new arr every 50 ms
    let nextArr = createMatrix(cols, rows);
    //cycle through all positions
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        //if you have sand and no rock
        if (arr[i][j] > 0 && arr[i][j] !== 400) {
          //get random number for falling left or right
          let randInt = 1;
          if (Math.random() > 0.5) {
            randInt *= -1;
          }
          //if there is sand below
          if (arr[i][j + 1] > 0) {
            //if at edge, stay
            if (i == 0 || i == cols - 1) {
              nextArr[i][j] = arr[i][j];
            } else if (arr[i - 1][j + 1] > 0) {
              //if down left is sand, try right
              if (arr[i + 1][j + 1] > 0) {
                //if down right is also sand, stay
                nextArr[i][j] = arr[i][j];
              } else {
                //if down right is no sand, fall right
                nextArr[i + 1][j + 1] = arr[i][j];
              }
            } else {
              //if down left is no sand, check right
              if (arr[i + 1][j + 1] == 0) {
                //if they're both sand, choose random dir
                nextArr[i + randInt][j + 1] = arr[i][j];
              } else {
                nextArr[i - 1][j + 1] = arr[i][j];
              }
            }
          } else {
            //if not, fall
            nextArr[i][j + 1] = arr[i][j];
          }
          //if you're at the bottom, stay
          if (j == rows - 1) {
            nextArr[i][j] = arr[i][j];
          }
        } else if (arr[i][j] == 400) {
          //if rock
          nextArr[i][j] = arr[i][j];
        }
      }
    }
    arr = nextArr;
  }, delay);
}

function reset() {
  arr = createMatrix(cols, rows);
}
//register presses
let mouse1;
document.addEventListener("mousedown", () => {
  if (document.querySelector("input:hover") === null) {
    mouse1 = true;
  }
});

document.addEventListener("mouseup", () => {
  mouse1 = false;
});

//for mobile
document.addEventListener("touchstart", () => {
  if (document.querySelector("input:hover") === null) {
    mouse1 = true;
  }
});

document.addEventListener("touchend", () => {
  mouse1 = false;
});

//color stuff
//change fps
function fpsChange() {
  window.clearInterval(updateLoop);
  delay = Math.abs(document.getElementById("fpsSlider").value - 100);
  startLoop();
}
function brushChange() {
  brushSize = document.getElementById("brushSlider").value / 10;
}

//test
function withinCols(i) {
  return i >= 0 && i <= cols - 1;
}
function withinRows(j) {
  return j >= 0 && j <= rows - 1;
}
