const path = require("path");
const fs = require("fs");

//read input.txt, to string, trim, split by line
let terminalOutput = fs.readFileSync(path.join(__dirname, '/input.txt')).toString('UTF8').trim().split('\n');

//console.log(terminalOutput);
let coordinates = [];
let temp = [];

//create array^2 with each item containing string of coordinate pairs => temp
terminalOutput.forEach((line) =>
  temp.push(line.split(' -> '))
)

//create array^2 with each item containing array of coordinate pairs as string
for (let i = 0; i < temp.length; i++) {
  coordinates.push([])
  for (let j = 0; j < temp[i].length; j++) {
    coordinates[i].push(temp[i][j].split(','))
  }
}
console.log(coordinates);
//convert all strings in coordinate array to integers
for (let i = 0; i < coordinates.length; i++) {
  for (let j = 0; j < coordinates[i].length; j++) {
    for (let k = 0; k < coordinates[i][j].length; k++) {
      coordinates[i][j][k] = parseInt(coordinates[i][j][k])
    }
  }
}

//console.log(coordinates);
//  detects min and max X and Y values
let minX = 1000000;
let minY = 1000000;
let maxX = -1000000;
let maxY = -1000000;
for (let i = 0; i < coordinates.length; i++) {
  for (let j = 0; j < coordinates[i].length; j++) {
    if (coordinates[i][j][0] < minX) {
      minX = coordinates[i][j][0]
    }
    if (coordinates[i][j][0] > maxX) {
      maxX = coordinates[i][j][0]
    }
    if (coordinates[i][j][1] < minY) {
      minY = coordinates[i][j][1]
    }
    if (coordinates[i][j][1] > maxY) { maxY = coordinates[i][j][1] }
  }
}

//console.log(minX, maxX, minY, maxY);
//grid sizing mechanism - detect size, adjusts x coordinates and creates grid as if xmin=1 and xmax=xmax+1-xmin. y coordinates are read as listed.
let grid = [];
for (let i = 0; i <= maxY + 2; i++) {
  grid.push([])
  for (let j = 0; j < Math.max((2 * (maxY + 2) + 3), ((maxX - minX) + 5)); j++) {
    grid[i].push([])

  }
}
//console.log(grid);

//Since each pair of coordinates represent a line between the coordinates, this creates an an equivalent array containing the coordinate pairs listed in var coordinates as well as all of the intermediate coordinate pairs.
let coordinatesToPush = [];
for (let i = 0; i < coordinates.length; i++) {
  coordinatesToPush.push([])
  for (let j = 0; j < coordinates[i].length - 1; j++) {
    let temp = 0;
    //horizontal (x) lines
    if (coordinates[i][j][0] === coordinates[i][j + 1][0]) {

      for (let k = 0; k < Math.abs(coordinates[i][j + 1][1] - coordinates[i][j][1]); k++) {
        //x incrementing
        if (coordinates[i][j + 1][1] > coordinates[i][j][1]) {
          temp = coordinates[i][j][1] + k
          coordinatesToPush[i].push([coordinates[i][j][0], temp])
        }
        //x decrementing
        if (coordinates[i][j + 1][1] < coordinates[i][j][1]) {
          temp = coordinates[i][j][1] - k
          coordinatesToPush[i].push([coordinates[i][j][0], temp])
        }
      }
    }
    //vertical (y) lines
    if (coordinates[i][j][1] === coordinates[i][j + 1][1]) {
      for (let k = 0; k < Math.abs(coordinates[i][j + 1][0] - coordinates[i][j][0]); k++) {
        //y incrementing
        if (coordinates[i][j + 1][0] > coordinates[i][j][0]) {
          temp = coordinates[i][j][0] + k
          coordinatesToPush[i].push([temp, coordinates[i][j][1]])
        }
        //y decrementing
        if (coordinates[i][j + 1][0] < coordinates[i][j][0]) {
          temp = coordinates[i][j][0] - k
          coordinatesToPush[i].push([temp, coordinates[i][j][1]])
        }
      }
    }
  } coordinatesToPush[i].push(coordinates[i][coordinates[i].length - 1])
}

//console.log(coordinatesToPush); //Output contains nested array containing every coordinate pair containing a rock

//establish left margin for rock/cave alignment
let leftMargin = 500 - (maxY + 3)

//fills grid with rocks; cave alignment is properly centered on the square of sand entry (500,0). Code would have to be updated for different start coordinate.
for (let i = 0; i < coordinatesToPush.length; i++) {
  for (let j = 0; j < coordinatesToPush[i].length; j++) {
    grid[coordinatesToPush[i][j][1]][coordinatesToPush[i][j][0] - (leftMargin)] = '#'
  }
}

//create "floor" of cave for eventual detection method. (Detect if sand has landed on level above groud)
for (let i = 0; i < grid[grid.length - 1].length; i++) {
  grid[grid.length - 1][i] = '#'
}
// fill rest of grid with air

for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[i].length; j++) {
    if (grid[i][j] !== '#') {
      grid[i][j] = '.'
    }
  }
}
//console.log(grid);

//sand falling simulator
let sandComplete = false;
let sandCount = -1;//set to -1 for part 1;set to 0 for part 2 - Part 1 is asking for how many sand fall 'before' the first sand falls onto the "floor" of the cave. Part 2 is aking for how much sand falls until the starting position is covered with sand (counting the grain of sand that covers it)
while (!sandComplete) {
  //initializes starting position
  grid[0][500 - leftMargin] = "+"
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      //if the square below current position of sand is "." (air), set position below to "o" (falling sand), and set current position to "." (air)
      if ((grid[i][j] === "+" || grid[i][j] === "o") && (grid[i + 1][j] === ".")) {
        grid[i][j] = "."; grid[i + 1][j] = "o";
      }
      //if the square below current position is not "." (air)
      else if ((grid[i][j] === "+" || grid[i][j] === "o") && (grid[i + 1][j] === "#" || grid[i + 1][j] === "x")) {
        //Check position left 1 & down 1 for air, if air proceed with falling to that position, else..
        if (grid[i + 1][j - 1] === ".") { grid[i][j] = "."; grid[i + 1][j - 1] = "o" }
        //else..check position right 1 & down 1 for air, if air proceed with falling to that position, else..
        else if (grid[i + 1][j + 1] === ".") { grid[i][j] = "."; grid[i + 1][j + 1] = "o"; }
        //else.. replace current position with "x" (settled sand)
        else {
          grid[i][j] = "x";
          //Part 2 while loop check
          if (grid[0][500 - leftMargin] === "x") {
            sandComplete = true;
          }
          //Part 1 while loop check; comment the next 3 lines for Part 2 check to take presidence. 
          for (let k = 0; k < grid[i].length; k++) {
            if (grid[grid.length - 2][k] === "x") { sandComplete = true; break; }
          }//comment until here for Part 2 solution
        }
      }
    }
  } sandCount++;
}


//console.log(grid);
console.log(sandCount);
console.log(sandComplete);

