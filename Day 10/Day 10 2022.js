let fs = require('fs');
let path = require('path');

let terminalOutput = fs.readFileSync(path.join(__dirname,'/Input.txt')).toString('UTF8').trim().split("\n");


let cycle=1;
let value=1;
let valuePairs={};
terminalOutput.forEach((line)=>{
  let instructions=line.split(' ');
 // console.log(instructions);

  if (line==='noop'){
    valuePairs[cycle]=value;cycle++;
  }
  if (line.startsWith("addx")){let integer=parseInt(line.slice(4));valuePairs[cycle]=value;cycle++;valuePairs[cycle]=value;cycle++;value+=integer; 
  }
}   )



//part 1 Solution
console.log(valuePairs[20]*20+valuePairs[60]*60+valuePairs[100]*100+valuePairs[140]*140+valuePairs[180]*180+valuePairs[220]*220)
//part 2

//convert object to array of keys and keypairs
let drawingInstructions=Object.entries(valuePairs)
for (let i=0;i<drawingInstructions.length;i++){
drawingInstructions[i][0]=parseInt(drawingInstructions[i][0])}

//drawing applicator. Input is line length (40 in this case). Creates # of lines = to ceil(length of drawing instructions divided by line length); if value+/-1 =cycle%mod40 ||value=cycle%40, then add '#', else add '.'
function drawingApplicator(lineLength){
  let array=[];
  for (let i=0;i<Math.ceil(drawingInstructions.length/lineLength);i++){
    array.push([""]);
  }
  for (let i=0;i<drawingInstructions.length;i++){
    if ((i%lineLength<drawingInstructions[i][1]+2)&&(i%lineLength>drawingInstructions[i][1]-2)){
      array[Math.floor(i/lineLength)]+='#'
    }
    else {array[Math.floor(i/lineLength)]+="."}
    
  }return array;
}

//console.log(drawingInstructions);

//Part 2 solution

console.log(drawingApplicator(40));


