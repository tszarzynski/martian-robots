/**
 * Moves logic
 */

const getFromArray = require("./utils").getFromArray;

// Directions
const directions = ["N", "E", "S", "W"];
//  Directions of moves
const moves = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0]
];

// Dictionary of all possible instructions. Allows further instruction addition.
const instructionsDict = {
  R: robot => rotateRobot(robot, 1),
  L: robot => rotateRobot(robot, -1),
  F: robot => moveRobot(robot, 1)
};

/**
 * Rotate robot
 * @param {*} robot Robot
 * @param {Number} rotationDirection "+1" to rotate right; "-1" to rotate left
 */
function rotateRobot(robot, rotationDirection) {
  return {
    ...robot,
    direction: getFromArray(
      directions,
      directions.indexOf(robot.direction) + rotationDirection
    )
  };
}

/**
 * Move robot
 * @param {*} robot
 * @param {Number} numOfSteps
 */
function moveRobot(robot, numOfSteps) {
  const nextMoveIndex = directions.indexOf(robot.direction);
  const nextMove = moves[nextMoveIndex]; //multipliers

  return {
    ...robot,
    position: [
      robot.position[0] + numOfSteps * nextMove[0],
      robot.position[1] + numOfSteps * nextMove[1]
    ]
  };
}

/**
 * Apply single instruction to robot
 * @param {*} robot
 * @param {String} instruction
 */
function updateRobot(robot, instruction) {
  const instructionFunc = instructionsDict[instruction];

  if (instructionFunc) return instructionFunc(robot);
  else throw "Unsupported instruction!";
}

// check if number is in range
const inRange = (x, start, end) => (x - start) * (x - end) <= 0;
const checkIfInside = (grid, position) => {
  return inRange(position[0], 0, grid[0]) && inRange(position[1], 0, grid[1]);
};

// scents
const scents = [];
const checkIfDeadlyMove = (robot, instruction) => {
  return scents.some(
    scent =>
      scent.position[0] == robot.position[0] &&
      scent.position[1] == robot.position[1] &&
      scent.direction == robot.direction &&
      scent.instruction == instruction
  );
};

/**
 * Perform all the instruction for all the robots
 * @param {*} grid
 * @param {Array} robots
 */
function move(grid, robots) {
  return robots.map(robot => {
    return robot.instructions.reduce((robot, instruction) => {
      // if robot already lost ignore remaining instructions
      if (robot.status == "LOST") return robot;

      // if scent detected ignore instruction
      if (checkIfDeadlyMove(robot, instruction)) {
        return robot;
      }

      let updatedRobot = updateRobot(robot, instruction);

      // check if robot is inside grid
      if (!checkIfInside(grid, updatedRobot.position)) {
        // if robot died cancel last move
        updatedRobot = robot;
        // mark robot as LOST
        updatedRobot.status = "LOST";

        // mark position as scent
        scents.push({
          position: robot.position,
          direction: robot.direction,
          instruction
        });
      }

      return updatedRobot;
    }, robot);
  });
}

exports.move = move;
