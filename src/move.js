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

const movesDict = {
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
  return movesDict[instruction](robot);
}

// check if number is in range
const inRange = (x, start, end) => (x - start) * (x - end) <= 0;
const checkIfInside = (grid, position) => {
  return inRange(position[0], 0, grid[0]) && inRange(position[1], 0, grid[1]);
};

function move(grid, robots) {
  return robots.map(robot => {
    return robot.instructions.reduce((robot, instruction) => {
      if (robot.status == "LOST") return robot;

      let updatedRobot = updateRobot(robot, instruction);

      if (!checkIfInside(grid, updatedRobot.position)) {
        // if robot died cancel last move
        updatedRobot = robot;
        // mark robot as LOST
        updatedRobot.status = "LOST";
      }

      return updatedRobot;
    }, robot);
  });
}

exports.move = move;
