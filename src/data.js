/**
 * Loading and processin the input data
 */

const fs = require("fs").promises;
const path = require("path");
const config = require("./config");
const compose = require("./utils").compose;

// input data file path
const filePath = path.join(__dirname, config.INPUT_FILE_NAME);

/**
 * Load input data file
 */
async function loadInputData() {
  return fs.readFile(filePath, { encoding: "utf-8" });
}

/**
 * Convert text into array of lines and remove empty ones
 * @param {String} rawData
 */
function convertToArray(rawData) {
  return rawData.split("\n").filter(line => line != "");
}

/**
 * Validate input data.
 * @param {Array} arrData
 */
function validateInputData(arrData) {
  // simple check if input data contains odd number of lines
  if (arrData.length % 2 == 0) throw "Input data corrupted!";

  return arrData;
}

/**
 * Process position data line from input file
 * @param {String} line
 */
function parsePositionLine(line) {
  const arr = line.trim().split(" ");
  return { position: [parseInt(arr[0]), parseInt(arr[1])], direction: arr[2] };
}

/**
 * Process instructions data line from input file
 * @param {String} line
 */
function parseInstructionsLine(line) {
  return line.trim().split("");
}

function parseGridLine(line) {
  return line
    .trim()
    .split(" ")
    .map(Number);
}

/**
 * Process input data in one go reading line by line
 * @param {Array} arrData
 */
function processInputData(arrData) {
  return arrData.reduce(
    (acc, currentLine, index) => {
      // get first line with grid coords
      if (index == 0) {
        return { ...acc, grid: parseGridLine(currentLine) };
      } else {
        // remaining lines contain robots data
        // which robot are we processing
        const robotIndex = Math.ceil(index / 2) - 1;
        const robot = acc.robots[robotIndex];
        let robots = acc.robots;

        if (robot) {
          // read instructions line and add to the current robot object
          robots = robots.map((r, idx) =>
            idx == robotIndex
              ? { ...r, instructions: parseInstructionsLine(currentLine) }
              : r
          );
        } else {
          // read position line and add a new robot with status field
          robots = [
            ...robots,
            {
              ...({ direction, position } = parsePositionLine(currentLine)),
              status: ""
            }
          ];
        }

        return { ...acc, robots };
      }
    },
    { grid: {}, robots: [] }
  );
}

function validateCoords(coords, maxValue, msg = "Invalid input data!") {
  if (coords.some(v => v > maxValue)) {
    throw msg;
  }
}

/**
 * Validate processed data and check if all the values are within specified range
 */
function validateProcessedData({ grid, robots }) {
  //validate grid size
  validateCoords(grid, config.MAX_COORDS_VALUE, "Invalid grid size!");

  robots.forEach(robot => {
    //validate instructions length
    if (robot.instructions.length > config.MAX_INSTRUCTIONS_LENGTH)
      throw "Invalid instructions length!";
    //validate robot initial position
    validateCoords(robot.position, config.MAX_COORDS_VALUE);
  });

  return { grid, robots };
}

/**
 * Load and process input data. Returns {grid, robots}.
 */
async function getData() {
  return compose(
    validateProcessedData,
    processInputData,
    validateInputData,
    convertToArray,
    loadInputData
  )();
}

exports.getData = getData;
