const fs = require('fs');
const path = require('path');


const terminalOutput = fs.readFileSync(path.join(__dirname, '/input.txt')).toString('UTF8').trim().split('\n')

const fileSystem = {};
const currentDirectory = [];

terminalOutput.forEach((line) => {
  const outputParts = line.split(' ');
  if (line.startsWith('$')) {
    const commandParts = outputParts.slice(1);
    if (commandParts[0] === 'cd') {
      const dir = commandParts[1];
      if (dir === '..') { currentDirectory.pop(); }
      else {
        currentDirectory.push(dir);
      }
    } else if (commandParts[0] === 'ls') { fileSystem[currentDirectory] = 0 }

  } else {
    if (outputParts[0] !== 'dir') { const fileSize = parseInt(outputParts[0]); fileSystem[currentDirectory] += fileSize; }
  }
}
)
//ask about Object.entries
const fileSystemEntries= Object.entries(fileSystem);
const dirSizes=[];

//ask about const [dirName,dirSize] of fileSystemEntries
for (const [dirName,dirSize] of fileSystemEntries){
  let subdirTotalSize=0;
  fileSystemEntries.forEach((entry)=>{
const [name,size]=entry;
    if (name.startsWith(dirName)&&name!==dirName){subdirTotalSize+=size;}
  }) 
  //console.log(subdirTotalSize);
  dirSizes.push(dirSize+subdirTotalSize);
}

//part 1
function sumLessThan100() {
  let sumValue=0;
  for (let i=0;i<dirSizes.length;i++){
    if (dirSizes[i]<100000){
      sumValue+=dirSizes[i]
    }
  }return sumValue
}


console.log('Part 1:',sumLessThan100());

//Another way of calculating part 1, look into filter/reduce methods.
//console.log('Part1:', dirSizes.filter((value) => value <= 100_000).reduce((sum, value) => sum + value, 0))

//part 2

const spaceNeeded=30000000-(70000000-dirSizes[0])

function smallestViableDirectory(){
  let directorySize=dirSizes[0]
  for (let i=0;i<dirSizes.length;i++){
    if (dirSizes[i]>spaceNeeded&&dirSizes[i]<directorySize){directorySize=dirSizes[i];}
  }
  return directorySize;
}

console.log('Part 2:',smallestViableDirectory());

//Another way of calculating part 2, look into filter/reduce methods
/*const candidateDirectories = dirSizes.filter((size) => size >= spaceNeeded)
console.log('Part2:', Math.min(...candidateDirectories))*/

//console.log(terminalOutput);
//console.log(fileSystem);
//console.log(fileSystemEntries);
//console.log(dirSizes);
