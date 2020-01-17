/**
 * Main entry file
 */

const { getData } = require("./data");
const { move } = require("./move");
const { print } = require("./utils");
const config = require("./config");

(async () => {
  try {
    // load data
    const { grid, robots } = await getData();
    // print input data
    console.log(config.LOGO);
    console.log("\nGRID SIZE:", grid.join(" "));
    console.log("\nINPUT:");
    print(robots, true);
    // execute instructions
    const output = move(grid, robots);
    // print formatted output
    console.log("\nOUTPUT:");
    print(output);
  } catch (e) {
    console.log(e);
  }
})();
