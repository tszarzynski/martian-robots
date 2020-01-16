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
 * Convert text into array of lines
 * @param {String} rawData
 */
function convertToArray(rawData) {
  return rawData.split("\n").filter(line => line != "");
}

/**
 * Validate input data
 * @param {Array} arrData
 */
function validateInputDate(arrData) {
  // simple check if input data contains odd number of elements
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
 * Process input data
 * @param {Array} arrData Input data
 */
function processInputData(arrData) {
  return arrData.reduce(
    (acc, currentLine, index) => {
      // get first line with grid coords
      if (index == 0) {
        return { ...acc, grid: parseGridLine(currentLine) };
      } else {
        // which robot are we processing
        const robotIndex = Math.ceil(index / 2) - 1;
        const robot = acc.robots[robotIndex];
        let robots = acc.robots;

        if (robot) {
          // reading instructions line and add to the current robot object
          robots = robots.map((r, idx) =>
            idx == robotIndex
              ? { ...r, instructions: parseInstructionsLine(currentLine) }
              : r
          );
        } else {
          // reading position line and adding new robot object
          robots = [
            ...robots,
            ({ direction, position } = parsePositionLine(currentLine))
          ];
        }

        return { ...acc, robots };
      }
    },
    { grid: {}, robots: [] }
  );
}
/**
 * Load and process input data
 */
async function getData() {
  return compose(
    processInputData,
    validateInputDate,
    convertToArray,
    loadInputData
  )();
}

exports.getData = getData;
