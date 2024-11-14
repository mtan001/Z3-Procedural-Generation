import './style.css'
import { init } from 'z3-solver';

// TILE IDS
const fenceTL = 45;
const fenceTR = 47;
const fenceBL = 69;
const fenceBR = 71;
const fenceVS = 60 // fence vertical side 
const fenceHS = 82; // fence horizontal side 
const fenceM = 46; // fence middle post
const fenceG = 70; // fence gate
const fenceL = 57;
const fenceR = 59;

const { Context } = await init();
const { Solver, Int, And, Or, Distinct, Not } = new Context("main");
const solver = new Solver();

const x = Int.const('x');
const y = Int.const('y');

console.log("map grid");
console.log(tinyTownGrid);

// get tinyTownGrid coords of where fence boundaries are

function getFenceBoundaries(tinyTownGrid, x, y) {
  let x1 = x;
  let y1 = y;
  let x2, y2 = 0;
  let horizontalFenceTiles = {fenceHS, fenceM, fenceG};
  let verticalFenceTiles = {fenceVS, fenceL};
  while (x < tinyTownGrid[y1].length) {
    if (tinyTownGrid[y1][x] == fenceTR) {
      x2 = x;
      break;
    }
    x++;
  }
  while (y < tinyTownGrid.length) {
    if (tinyTownGrid[y][x1] == fenceBL) {
      y2 = y;
      break;
    }
    y++;
  }
  return {x1: x1, x2: x2, y1: y1, y2: y2};
}

let fenceBoundaries = [];
for (let y = 0; y < tinyTownGrid.length; y++) {
  for (let x = 0; x < tinyTownGrid[y].length; x++) {
    if (tinyTownGrid[y][x] == fenceTL) {
      fenceBoundaries.push(getFenceBoundaries(tinyTownGrid, x, y));
    }
  }
}
console.log(fenceBoundaries);

// get coords of existing trees and mushrooms


// Z3 random algorithm

function getCoords(){
  const model = solver.model();
  const xVal = parseInt(model.eval(x));
  console.log(`${xVal}`);
  const yVal = parseInt(model.eval(y));
  console.log(`${yVal}`);
  let coords = [yVal, xVal];
  solver.reset();
  return coords;
}

// wheelbarrow inside fenced-in area
let wheelbarrow = [];
for (let j = 0; j < fenceBoundaries.length; j++) {
  let possibleCoords = [];
  while (1){
    // initial constraints
    solver.add(And(x.gt(fenceBoundaries[j].x1), x.lt(fenceBoundaries[j].x2)));
    solver.add(And(y.gt(fenceBoundaries[j].y1), y.lt(fenceBoundaries[j].y2)));
    if (await solver.check() == "unsat"){
      solver.reset();
      break;
    }
    console.log("sat!");
    // add valid value as possible value and negative constraint
    let coord = getCoords();
    possibleCoords.push(coord);
    for (let i = 0; i < possibleCoords.length; i++) {
      solver.add(Not(And(y.eq(possibleCoords[i][0]), x.eq(possibleCoords[i][1]))));
    }
  }
  console.log("possibleCoords");
  console.log(possibleCoords);
  // get random valid value
  let randInt = Math.floor(Math.random()*possibleCoords.length);
  wheelbarrow.push(possibleCoords[randInt]);
}
window.wheelbarrow = wheelbarrow;

game.scene.start('decorScene');