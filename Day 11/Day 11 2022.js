let fs = require('fs');
let path = require('path');
//convert input.txt to string by line

//Important Objects/Arrays/Functions:
//OutputAsObject{} - Object containing {Monkeys:{Command:Output}};
//trackerArray[] - array of [[n]] where n=number of monkeys; ex: n=5 array=[ [],[],[],[],[] ];
//monkeyBusiness() - function tracking the movement of items
let terminalOutput=fs.readFileSync(path.join(__dirname,'/Input.txt')).toString('UTF8').trim().split('\n');

//Create nested array containing each item by line split by ":"
let outputAsSplit=[];
for (let i=0;i<terminalOutput.length;i++){
  outputAsSplit.push(terminalOutput[i].trim().split(':'))
}
//console.log(outputAsSplit);


//Create object to contain {Monkeys:{Command:Output}}
let outputAsObject={};
for (let i=0;i<outputAsSplit.length;i++){
  if (outputAsSplit[i][0]==="Monkey " + i/7){
let outputLevelTwo={}
for (let j=i+1;j<i+6;j++){
  outputLevelTwo[outputAsSplit[j][0]]=outputAsSplit[j][1].trim();
}
       outputAsObject[outputAsSplit[i][0]]=outputLevelTwo;
  }
}

//console.log(outputAsObject);


//convert to object for counting purposes
let objectToArray=Object.entries(outputAsObject);

//console.log(objectToArray.length);
//generate array to hold values of items held by monkeys at the start. Values will be manipulated within this array
let trackerArray=[];
//generate array to track number of times an item was checked for each monkey. Size of array = [[n]];
let itemCheckerArray=[];
for (let i=0;i<objectToArray.length;i++){
  trackerArray.push([]);itemCheckerArray.push([0]);
}

//retrive starting items held by each monkey from outputAsObject['Monkey ' + i]['Starting items'] 
for (let i=0;i<objectToArray.length;i++){
let temp = outputAsObject['Monkey ' + i]['Starting items'].split(', ')
  //console.log(temp);
  for (let j=0;j<temp.length;j++){
    trackerArray[i].push(BigInt(parseInt(temp[j])));
  }
}
console.log(5n%2n);
  console.log(trackerArray);
console.log(itemCheckerArray);

/*function bigIntModulo(x,y){
  y = BigInt(y);
  let result = x - (x / y) * y;
  return result
}*/


function monkeyBusiness(num){
  for (let k=0;k<num;k++){
  for (let i=0;i<trackerArray.length;i++){
    for (let j=0;j<trackerArray[i].length;j++){

      //Operation for monkeys
      if (outputAsObject['Monkey ' + i]['Operation'].slice(12)==="old"){trackerArray[i][j]*=trackerArray[i][j];
        
      }
      else {if (outputAsObject['Monkey ' + i]['Operation'].slice(10,11)==='+'){trackerArray[i][j]+=BigInt(parseInt(outputAsObject['Monkey ' + i]['Operation'].slice(12)))}
      if (outputAsObject['Monkey ' + i]['Operation'].slice(10,11)==='-'){trackerArray[i][j]-=BigInt(parseInt(outputAsObject['Monkey ' + i]['Operation'].slice(12)))}
      if (outputAsObject['Monkey ' + i]['Operation'].slice(10,11)==='*'){trackerArray[i][j]*=BigInt(parseInt(outputAsObject['Monkey ' + i]['Operation'].slice(12)))}
      if (outputAsObject['Monkey ' + i]['Operation'].slice(10,11)==='/'){trackerArray[i][j]/=BigInt(parseInt(outputAsObject['Monkey ' + i]['Operation'].slice(12)))}}
//divide worry by 3 rounded down
  //  trackerArray[i][j]=Math.floor(trackerArray[i][j]/3) 
      //Increment inspection counter for Monkey[i]
      itemCheckerArray[i]++;
      //Monkeys test Item and push to new array
if (trackerArray[i][j]%BigInt(parseInt(outputAsObject['Monkey ' + i]['Test'].slice(13)))==0){trackerArray[(outputAsObject['Monkey ' + i]['If true'].slice(16))].push(trackerArray[i][j])}
      else {trackerArray[(outputAsObject['Monkey ' + i]['If false'].slice(16))].push(trackerArray[i][j])}
     
    } //Monkeys toss as they go, but for the sake of simplification I treated it as if they toss all at once.
    for (let l=0;l<trackerArray[i].length;l++){trackerArray[i]=[];}
    
  }}return itemCheckerArray;
}
console.log(monkeyBusiness(250));

//console.log(monkeyBusiness(10000));
//console.log(itemCheckerArray);

function sumOfTopTwo(){
  let highestNum=-1;
  let secondHighestNum=-2;
  let sum = 1;
  for (let i=0;i<itemCheckerArray.length;i++){
    if (itemCheckerArray[i]>highestNum){secondHighestNum=highestNum;highestNum=itemCheckerArray[i];}
    else if (itemCheckerArray[i]>secondHighestNum){secondHighestNum=itemCheckerArray[i];}
    
  }sum = highestNum*secondHighestNum;
  return sum
}
console.log(sumOfTopTwo());



