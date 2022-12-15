let fs = require('fs');
let path = require('path');

//stores array of inputs as strings, split by line+trim
let terminalOutput = fs.readFileSync(path.join(__dirname, '/input.txt')).toString('UTF8').trim().split('\n');

//cloning function for cloning nested arrays
function clone(old) { return JSON.parse(JSON.stringify(old)); }

//creates array with dimensions [[]] to store maze as a grid
let grid = [];
terminalOutput.forEach((line) => {
  grid.push(line.split(''));
})


//Original Maze as grid with Letters
let originalInput = clone(grid);

//Converts Maze to grid with numbers for easier mathematical comparison
for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[i].length; j++) {
    grid[i][j] = grid[i][j].replace(/[a-z]/g, m => m.charCodeAt() - 96)
  }
}

//Creates clone for mapping distance
let mazeTracker = clone(grid);

//replaces all values of mazeTracker except for E and S with dummy value -1
for (let i = 0; i < mazeTracker.length; i++) {
  for (let j = 0; j < mazeTracker[i].length; j++) {
    if (!isNaN(mazeTracker[i][j])) {
    mazeTracker[i][j] = -1
    }
  }
}

//stores cordinate values of start position
let startChecker = [];
for (let i = 0; i < mazeTracker.length; i++) {
  for (let j = 0; j < mazeTracker[i].length; j++) {
    if (mazeTracker[i][j] === "S") {
      startChecker.push(i); startChecker.push(j)
    }
    //else if (mazeTracker[i][j]==="E"){checker.push(mazeTracker[i][j] + "(" + i + "," + j+")")}
  }
}

console.log(startChecker);


//Maze Solver function. Inputs array and string, and outputs distance to S as well as closest distance to string
function mazeSolver(array, string) {
  let countCheck = 1;
/*initializes position starting at 'E'. 

'E' has the same value as z, but I wasn't sure how to differentiate E from z's without affecting the pathing. 
 ex. if I assigned E a value of 27, and began with the highest value, z's would be assigned 1, but y's would not; even though they are an elligible path from E. 
  If I assigned E a value of 26 (so y's would path correctly, then the loop would treat the first slot with value 26 (E or z) as the starting point.)
  More consideration needed*/
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if (array[i][j] === "E") {
        //up check
        if (i !== 0 && array[i - 1][j] === -1) {
          if (grid[i - 1][j] >= 25) {
            array[i - 1][j] = countCheck;
          }
        }
        //down check
        if (i !== array[i].length - 1 && array[i + 1][j] === -1) { if (grid[i + 1][j] >= 25) { array[i + 1][j] = countCheck; } }
        //left check
        if (j !== 0 && array[i][j - 1] === -1) {
          if (grid[i][j - 1] >= 25) {
            array[i][j - 1] = countCheck;
          }
        }
        //right check
        if (j !== array[i][j].length - 1 && array[i][j + 1] === -1) { if (grid[i][j + 1] >= 25) { array[i][j + 1] = countCheck; } }
        array[i][j] = "Exit";
      }
    }
  }







//created four variable to represent positions orthogonal to starting position

  let temp1 = -1;
  let temp2 = -1;
  let temp3 = -1;
  let temp4 = -1

  //loops run while all four of the orthogonal positions contains -1. Once one of the orthogonal positions is assigned, while loop terminates and maze is solveable.
  while (temp1 === -1 && temp2 === -1 && temp3 === -1 && temp4) {
    countCheck++;

    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        if (array[i][j] === countCheck - 1) {
          //Up Check
          if (i !== 0 && array[i - 1][j] === -1) {
            if (grid[i - 1][j] >= grid[i][j] - 1) {
              array[i - 1][j] = countCheck;
            }
          }
          //down check
          if (i !== array.length - 1 && array[i + 1][j] === -1) { if (grid[i + 1][j] >= grid[i][j] - 1) { array[i + 1][j] = countCheck; } }
          //left check
          if (j !== 0 && array[i][j - 1] === -1) {
            if (grid[i][j - 1] >= grid[i][j] - 1) {
              array[i][j - 1] = countCheck;
            }
          }
          //right check
          if (j !== array[i].length - 1 && array[i][j + 1] === -1) { if (grid[i][j + 1] >= grid[i][j] - 1) { array[i][j + 1] = countCheck; } }

        }
      }

    }
    //verifies if slot exists, then assigns value of slot above S
    if (startChecker[0] !== 0) { temp1 = array[startChecker[0] - 1][startChecker[1]] }
    //verifies if slot exists, then assigns value of slot below S
    if (startChecker[0] !== array.length - 1) { temp2 = array[startChecker[0] + 1][startChecker[1]] }
    //verifies if slot exists, then assigns value of slot to the left of S
    if (startChecker[1] !== 0) { temp3 = array[startChecker[0][startChecker[1] - 1]] }
    //verifies if slot exists, then assigns value of slot to the right of S
    if (startChecker[1] !== array[0].length - 1) { temp4 = array[startChecker[0]][startChecker[1] + 1] }
  }

  //Part 1
  let outputOne = [];
  outputOne.push(temp1); outputOne.push(temp2); outputOne.push(temp3); outputOne.push(temp4);
  outputOne.sort((a, b) => b - a);
  for (let i = outputOne.length - 1; i > 0; i--) {
    if (outputOne[i] === -1) {
      outputOne.pop();
    }
  }
  outputOne.sort((a, b) => a - b);
  //Part 2

  let outputTwo = findNearest(string);

  //cleanly printing result
  let result = []
  result.push("Part 1: " + (outputOne[0]+1))
  result.push("Part 2: " + outputTwo)
  return result; //return output[0]; for part 1
}

//inputs string and outputs distance of closest path to string

function findNearest(string) {
  let stringChecker = []
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (originalInput[i][j] === string && mazeTracker[i][j] !== -1) { stringChecker.push(mazeTracker[i][j]) }
    }
  }
  stringChecker.sort((a, b) => a - b);

  return stringChecker[0]
}

//print results to console
console.log(mazeSolver(mazeTracker, 'a'));
