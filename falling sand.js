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
const cols = 30;
const rows = 30;
let arr = createMatrix(cols, rows);
function setup() {
  createCanvas(400, 400);
}

function draw() {
  //draw the array
  let squareSize = width / cols;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (arr[i][j] == 1) {
        fill("white");
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
  if (mouseIsPressed) {
    arr[mouseCol][mouseRow] = 1;
  }

  //coords
  fill("white");
  text(`X: ${mouseCol}, Y: ${mouseRow}`, 0, 10);
}

window.setInterval(() => {
  //create a new arr every 50 ms
  let nextArr = createMatrix(cols, rows);
  //cycle through all positions
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      //if you have sand
      if (arr[i][j] == 1) {
        //get random number for falling left or right
        let randInt = 1;
        if (Math.random() > 0.5) {
          randInt *= -1;
        }
        //if there is sand below
        if (arr[i][j + 1] == 1) {
          //if at edge, stay
          if (i == 0 || i == cols - 1) {
            nextArr[i][j] = 1;
          } else if (arr[i - 1][j + 1] == 1) {
            //if down left is sand, try right
            if (arr[i + 1][j + 1] == 1) {
              //if down right is also sand, stay
              nextArr[i][j] = 1;
            } else {
              //if down right is no sand, fall right
              nextArr[i + 1][j + 1] = 1;
            }
          } else {
            //if down left is no sand, check right
            if (arr[i + 1][j + 1] == 0) {
              //if they're both sand, choose random dir
              nextArr[i + randInt][j + 1] = 1;
            } else {
              nextArr[i - 1][j + 1] = 1;
            }
          }
        } else {
          //if not, fall
          nextArr[i][j + 1] = 1;
        }
        //if you're at the bottom, stay
        if (j == rows - 1) {
          nextArr[i][j] = 1;
        }
      }
    }
  }
  arr = nextArr;
}, 50);
