const fs = require('fs');
const path = require('path');
//read input data as string and split by line
const terminalOutput = fs.readFileSync(path.join(__dirname, '/input.txt')).toString('UTF8').trim().split('\r\n')

//function for cloning nested objects
function clone(old) { return JSON.parse(JSON.stringify(old)); }

//create nested array with array[i] containing each line and array[i][j] containing each character of each line
let outputPerLine = [];
terminalOutput.forEach((line) => {
  outputPerLine.push(line.split(""))
})
//create duplicate to remain as strings for visibility check and duplicate for Scenic value calculation
let duplicate = clone(outputPerLine);
let lineOfSight = clone(outputPerLine);


//convert outputPerLine to integers
for (let i = 0; i < outputPerLine.length; i++) {
  for (let j = 0; j < outputPerLine[i].length; j++)
    outputPerLine[i][j] = parseInt(outputPerLine[i][j]);
}

//Part 1
function visibilityCheck() {
  //initialize checkers
  let leftChecker = -1;
  let topChecker = -1;
  let rightChecker = -1;
  let bottomChecker = -1;

  //loop for left and top sides
  for (let i = 0; i < outputPerLine.length; i++) {
    for (let j = 0; j < outputPerLine[i].length; j++) {
      //checks from top
      if (outputPerLine[j][i] > topChecker) { duplicate[j][i] = "visible"; topChecker = outputPerLine[j][i]; }
      //checks from left
      if (outputPerLine[i][j] > leftChecker) { duplicate[i][j] = "visible"; leftChecker = outputPerLine[i][j]; }
    } leftChecker = -1; topChecker = -1;
  }
  //loop for bottom and right sides
  for (let i = outputPerLine.length - 1; i > -1; i--) {
    for (let j = outputPerLine[i].length - 1; j > -1; j--) {
      //checks from bottom
      if (outputPerLine[j][i] > bottomChecker) { duplicate[j][i] = "visible"; bottomChecker = outputPerLine[j][i]; }
      //checks from right
      if (outputPerLine[i][j] > rightChecker) { duplicate[i][j] = "visible"; rightChecker = outputPerLine[i][j]; }

    } bottomChecker = -1; rightChecker = -1;
  }
  //sum visible trees
  let count = 0;
  for (i = 0; i < duplicate.length; i++) {
    for (j = 0; j < duplicate[i].length; j++) {
      if (duplicate[i][j] === "visible") {
        count++;
      }
    }
  }
  return count;
}

//Part 2

function lineOfSightCounter() {
  //generate array lineOfSight with edges containing value of 0 and all else containing value of 1
  for (let i = 0; i < lineOfSight.length; i++) {
    for (let j = 0; j < lineOfSight[i].length; j++) {
      if (i === 0 || j === 0 || i === lineOfSight.length - 1 || j === lineOfSight[i].length - 1) {
        lineOfSight[i][j] = 0;
      } else { lineOfSight[i][j] = 1 }
    }
  }

  //initialize counter
  let counter = 0;

/*for each check..for each value in outputPerLine, compare value to values (left,right,above,below) and increment counter if larger.  Once finding a value that is equal to or less (or array ends), multiply equivalent position in lineOfSight by counter, reset counter, then proceed*/
  
  //Right facing check

  for (let i = 1; i < outputPerLine.length - 1; i++) {
    for (let j = 1; j < outputPerLine[i].length - 1; j++) {
      let heightCheck = outputPerLine[i][j];
      for (let k = j + 1; k < outputPerLine[j].length; k++) {
        if (heightCheck > outputPerLine[i][k]) {
          counter++;
        }
        else { counter++; break; }
      } lineOfSight[i][j] *= counter; counter = 0;
    }
  }

  //Down facing check

  for (let i = 1; i < outputPerLine.length - 1; i++) {
    for (let j = 1; j < outputPerLine[i].length - 1; j++) {
      let heightCheck = outputPerLine[i][j];
      for (let k = i + 1; k < outputPerLine[i].length; k++) {
        if (heightCheck > outputPerLine[k][j]) {
          counter++;
        }
        else { counter++; break; }
      } lineOfSight[i][j] *= counter; counter = 0;
    }
  }

  //Left facing check
  for (let i = 0; i < outputPerLine.length - 1; i++) {
    for (let j = outputPerLine[i].length - 2; j > 1; j--) {
      let heightCheck = outputPerLine[i][j];
      for (let k = j - 1; k > -1; k--) {
        if (heightCheck > outputPerLine[i][k]) {
          counter++;
        }
        else { counter++; break; }
      } lineOfSight[i][j] *= counter; counter = 0;
    }
  }


  //Up facing check
  for (let i = outputPerLine.length - 2; i > 1; i--) {
    for (let j = 0; j < outputPerLine[i].length; j++) {
      let heightCheck = outputPerLine[i][j];
      for (let k = i - 1; k > -1; k--) {
        if (heightCheck > outputPerLine[k][j]) {
          counter++
        } else { counter++; break; }
      } lineOfSight[i][j] *= counter; counter = 0;
    }
  }

  //check for max value and output
  let finalValue = 0;
  for (let i = 0; i < lineOfSight.length; i++) {
    for (let j = 0; j < lineOfSight[i].length; j++) {
      if (lineOfSight[i][j] > finalValue) {
        finalValue = lineOfSight[i][j]
      }
    }
  }

  return finalValue;
}

//Part 1 answer
console.log(visibilityCheck());
//Part 2 answer
console.log(lineOfSightCounter());