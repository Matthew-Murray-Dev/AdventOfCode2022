

const fs = require('fs');
const path = require('path');
//read input data as string and split by line
let terminalOutput = fs.readFileSync(path.join(__dirname, '/Input.txt')).toString('UTF8').trim().split('\n');

//create nested array with array[i] containing each line and array[i][j] containing each character of each line
let outputPerLine = [];
terminalOutput.forEach((line) => {
  outputPerLine.push(line.split(" "));
})

//convert numericalvalue in OutputPerLine to integer
for (let i = 0; i < outputPerLine.length; i++) {
  outputPerLine[i][1] = parseInt(outputPerLine[i][1]);
}
//console.log(outputPerLine);



//function for tracking movement of T in relation to H
function movementTrackingT(hX, hY, tX, tY) {
  let temp = [tX, tY];
  //if H moves out of distance up&right
  if (hX > tX + 1 && hY >= tY + 1 || hY > tY + 1 && hX >= tX + 1) { tX++; tY++; temp[0] = tX; temp[1] = tY; }
  //if H moves out of distance up&left
  if (hX < tX - 1 && hY >= tY + 1 || hY > tY + 1 && hX <= tX - 1) { tX--; tY++; temp[0] = tX; temp[1] = tY; }
  //if H moves out of distance down&right
  if (hY < tY - 1 && hX >= tX + 1 || hX > tX + 1 && hY <= tY - 1) { tX++; tY--; temp[0] = tX; temp[1] = tY; }
  //if H moves out of distance down&left
  if (hX < tX - 1 && hY <= tY - 1 || hY < tY - 1 && hX <= tX - 1) { tX--; tY--; temp[0] = tX; temp[1] = tY; }

  //if H moves right
  if (hX > tX + 1 && hY === tY) { tX++; temp[0] = tX; temp[1] = tY; }
  //if H moves left
  if (hX < tX - 1 && hY === tY) { tX--; temp[0] = tX; temp[1] = tY; }
  //if H moves up
  if (hY > tY + 1 && hX === tX) { tY++; temp[0] = tX; temp[1] = tY; }
  //if H moves down
  if (hY < tY - 1 && hX === tX) { tY--; temp[0] = tX; temp[1] = tY; }

  return temp;
}


//function for tracking movement of H&T
function movementTrackingH(num) {
  if (num < 2) { return "Num must be 2 or greater"; }
  let cordStorage = [[0, 0], [0, 0]];
  for (let i = 0; i < num - 2; i++) {
    cordStorage.push([0, 0]);
  }

  let push = [0, 0]; //stores current output of MovementTrackingT
  let tTracker = [[0, 0]];//Stores cordinate output after each movement of MovementTrackingT for tail of size = num

  

  for (let i = 0; i < outputPerLine.length; i++) {
    //Moving Right
    if (outputPerLine[i][0] === 'R') {
      for (let j = 0; j < outputPerLine[i][1]; j++) {
        cordStorage[0][0]++;
        for (let k = 0; k < num - 1; k++) {

          push = movementTrackingT(cordStorage[k][0], cordStorage[k][1], cordStorage[k + 1][0], cordStorage[k + 1][1]);
          cordStorage[k + 1][0] = push[0]; cordStorage[k + 1][1] = push[1];
        } tTracker.push(push);
      }
    }
    //Moving Down
    if (outputPerLine[i][0] === 'D') {
      for (let j = 0; j < outputPerLine[i][1]; j++) {
        cordStorage[0][1]--;
        for (let k = 0; k < num - 1; k++) {
          push = movementTrackingT(cordStorage[k][0], cordStorage[k][1], cordStorage[k + 1][0], cordStorage[k + 1][1]);
          cordStorage[k + 1][0] = push[0]; cordStorage[k + 1][1] = push[1];
        } tTracker.push(push);
      }
    }
    //Moving Up
    if (outputPerLine[i][0] === 'U') {
      for (let j = 0; j < outputPerLine[i][1]; j++) {
        cordStorage[0][1]++;
        for (let k = 0; k < num - 1; k++) {
          push = movementTrackingT(cordStorage[k][0], cordStorage[k][1], cordStorage[k + 1][0], cordStorage[k + 1][1]);
          cordStorage[k + 1][0] = push[0]; cordStorage[k + 1][1] = push[1];
        } tTracker.push(push);
      }
    }

    //Moving Left
    if (outputPerLine[i][0] === 'L') {
      for (let j = 0; j < outputPerLine[i][1]; j++) {
        cordStorage[0][0]--;
        for (let k = 0; k < num - 1; k++) {

          push = movementTrackingT(cordStorage[k][0], cordStorage[k][1], cordStorage[k + 1][0], cordStorage[k + 1][1]);
          cordStorage[k + 1][0] = push[0]; cordStorage[k + 1][1] = push[1];
        } tTracker.push(push);
      }
    }
  } return tTracker;
}
//Output array of all positions that T has visited and assign as variable
let uniquePosition = movementTrackingH(10)//modify (num) depending on knot count



//Creating object for verifying # of unique values in Tail Cordinate Array
let uniquePositionObject = {}

//insert uniquePosition[i] as a key with dummy key pair value. If a key already exists, a duplicate key is not inserted for that value
for (let i = 0; i < uniquePosition.length; i++) {
  uniquePositionObject[uniquePosition[i]] = "Confirmed;"
}
//converts object with key and key pairs to an array with length of unique cordinate
let uniquePositionList = Object.entries(uniquePositionObject);
//Output
console.log(uniquePositionList.length);