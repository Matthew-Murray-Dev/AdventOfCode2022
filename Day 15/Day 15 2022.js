const fs = require('fs');
const path = require('path');
//Obtain output from input file as string, trimmed, split by line
let terminalOutput=fs.readFileSync(path.join(__dirname,'/input.txt')).toString('UTF8').trim().split('\n');

//console.log(terminalOutput);

//split each line into array containing [sensor info, closest beacon info]
let sensorBeaconPairs=[];
terminalOutput.forEach((line)=>{
  sensorBeaconPairs.push(line.split(": "))
})

//console.log(sensorBeaconPairs);

//Separate sensor info and beacon info into separate arrays
let sensorArray=[];
let beaconArray=[];
for (let i=0;i<sensorBeaconPairs.length;i++){
  sensorArray.push([sensorBeaconPairs[i][0]])
  beaconArray.push([sensorBeaconPairs[i][1]])
}

//Split x and y cordinate info for each into array containing [x cord info, y cord info]
let sensorCoords=[];
let beaconCoords=[];
sensorArray.forEach((line)=>{
  sensorCoords.push(line[0].split(","))
})
beaconArray.forEach((line)=>{
  beaconCoords.push(line[0].split(','))})

//remove all non-digit non-hyphen characters and parseInt
for (let i=0;i<sensorCoords.length;i++){
  for (let j=0;j<sensorCoords[i].length;j++){
    sensorCoords[i][j] = parseInt(sensorCoords[i][j].replace( /[^\d-]+/g, ''));
    beaconCoords[i][j]=parseInt(beaconCoords[i][j].replace(  /[^\d-]+/g,''));
  }
}
console.log(sensorCoords,beaconCoords);
//create list of beacon coordinates (no duplicates) by converting coords to object keys, then generating array from object keys
let beaconCoordsObj={};
for (let i=0;i<beaconCoords.length;i++){
beaconCoordsObj[beaconCoords[i]]=beaconCoords[i]}

beaconCoordsCheck=Object.entries(beaconCoordsObj);
 // beaconCoordsSet.push(beaconCoords[i][0],beaconCoords[i][1])

//obtain Manhattan Distance between each sensor and its nearest beacon
let manhattanDistanceArray=[];
for (let i=0;i<sensorCoords.length;i++){
  manhattanDistanceArray.push(Math.abs(sensorCoords[i][0]-beaconCoords[i][0])+Math.abs(sensorCoords[i][1]-beaconCoords[i][1]))
}

//console.log(beaconCoordsCheck)
//obtain lowest and highest x values for accurate range for sensor checking
let minX=Infinity;
let maxX=-Infinity;
for (let i=0;i<sensorCoords.length;i++){
  if ((sensorCoords[i][0]-manhattanDistanceArray[i])<minX){minX=sensorCoords[i][0]-manhattanDistanceArray[i]+1}
  
  if (sensorCoords[i][0]+manhattanDistanceArray[i]>maxX){maxX=sensorCoords[i][0]+manhattanDistanceArray[i]-1}
 
}

console.log(manhattanDistanceArray)
//Part 1
function rowAbsentBeacon(num){
  let count=0;
for (let i=minX;i<=maxX;i++){
  for (let j=0;j<sensorCoords.length;j++){
if ((Math.abs(sensorCoords[j][0]-i)+Math.abs(sensorCoords[j][1]-num))<=manhattanDistanceArray[j])
    {count++;break;}
    
  }for (let k=0;k<beaconCoordsCheck.length;k++){
    if((i+','+num)===beaconCoordsCheck[k][0]){count--;break;}
  }
}return count;}
//Part 1 answer
console.log(rowAbsentBeacon(2000000))


//Part 2

//This square will be located between the intersection point of four scanners, specifically their bottom right:\ bottom left:/ top right:\ and top left:/ sides.  Once the four nearby scanners are located, only the top two or bottom two scanners are needed since the square will be located 1 below the intersection point of the bottom right/left diagonal sides of the top two or 1 above the intersection point of the top right/left diagonal sides of the bottom two. (This works for both left scanners or both right scanners as well. I selected the bottom two scanners for this, though the output will be the same if coded properly for each scanner pair)
//obtain position of four sensors.  There will be two pairs of sensors for which the manhattan distance from eachother +2 is equal to the sum of their respective manhattan distances to the nearest beacon detected.
let fourSensors=[];
for (let i=0;i<sensorCoords.length-1;i++){
  for (let j=i+1;j<sensorCoords.length;j++){
    if ((Math.abs(sensorCoords[i][0]-sensorCoords[j][0])+Math.abs(sensorCoords[i][1]-sensorCoords[j][1])-2)===manhattanDistanceArray[i]+manhattanDistanceArray[j]){fourSensors.push([sensorCoords[i],manhattanDistanceArray[i]]);fourSensors.push([sensorCoords[j],manhattanDistanceArray[j]]);}
  }
}



//determine which sensor is top left/top right/bottom left/bottom right.
for (let i=0;i<fourSensors.length;i+=2){
if (fourSensors[i][0][0]>fourSensors[i+1][0][0]&&fourSensors[i][0][1]>fourSensors[i+1][0][1]){
fourSensors[i].push("TopRight");fourSensors[i+1].push("BottomLeft")}
if (fourSensors[i][0][0]<fourSensors[i+1][0][0]&&fourSensors[i][0][1]<fourSensors[i+1][0][1]){
fourSensors[i].push("BottomLeft");fourSensors[i+1].push("TopRight")}
if (fourSensors[i][0][0]<fourSensors[i+1][0][0]&&fourSensors[i][0][1]>fourSensors[i+1][0][1]){
fourSensors[i].push("TopLeft");fourSensors[i+1].push("BottomRight")}
if (fourSensors[i][0][0]>fourSensors[i+1][0][0]&&fourSensors[i][0][1]<fourSensors[i+1][0][1]){
fourSensors[i].push("BottomRight");fourSensors[i+1].push("TopLeft")
}
}
//pull coordinates points of the ends of the diagonal lines needed. the bottom right line (/) for the bottom left sensor and the bottom left line (\) for the bottom right sensor
let bottomLeftSensor=[];
let bottomRightSensor=[];
for (let i=0;i<fourSensors.length;i++){
  if (fourSensors[i][2]==="BottomLeft"){bottomLeftSensor.push([fourSensors[i][0][0],fourSensors[i][0][1]+fourSensors[i][1]]); bottomLeftSensor.push([fourSensors[i][0][0]+fourSensors[i][1],fourSensors[i][0][1]]);}
  if (fourSensors[i][2]==="BottomRight"){bottomRightSensor.push([fourSensors[i][0][0],fourSensors[i][0][1]+fourSensors[i][1]]);bottomRightSensor.push([fourSensors[i][0][0]-fourSensors[i][1],fourSensors[i][0][1]])}
}


let x1=bottomLeftSensor[0][0]
let x2=bottomLeftSensor[1][0]
let x3=bottomRightSensor[0][0]
let x4=bottomRightSensor[1][0]
let y1=bottomLeftSensor[0][1]
let y2=bottomLeftSensor[1][1]
let y3=bottomRightSensor[0][1]
let y4=bottomRightSensor[1][1]
//Formula for calculating pX and pY from (x1,y1),(x2,y2),(x3,y3),(x4,y4) - intersection point between two lines given two points on each line.
let pX=((((x1*y2-y1*x2)*(x3-x4))-((x1-x2)*(x3*y4-y3*x4)))/
(((x1-x2)*(y3-y4))-(y1-y2)*(x3-x4)))
let pY=((((x1*y2-y1*x2)*(y3-y4))-((y1-y2)*(x3*y4-y3*x4)))/
(((x1-x2)*(y3-y4))-(y1-y2)*(x3-x4)))

//pX of beacon
console.log(pX)
//pY of beacon - as stated above, pY of beacon will be pY of the intersection point + 1
console.log(pY+1)
//Part 2 answer
console.log(pX*4000000+pY+1)


//Turns out 16 Trillion coordinates are a lot to check D:

/*function positionContainingBeacon(num){
  
  let frequencyCheck;
  let frequency=[];
main: for (let i=0;i<num;i++){
  for (let l=0;l<=num;l++){
  for (let j=0;j<sensorCoords.length;j++){frequencyCheck=true;
if ((Math.abs(sensorCoords[j][0]-i)+Math.abs(sensorCoords[j][1]-l))<=manhattanDistanceArray[j]){frequencyCheck=false;break;}
   
    }if (frequencyCheck===true){frequency=(i*4000000+l);break main;}
  }
}return frequency;}*/


//console.log(positionContainingBeacon(4000000))