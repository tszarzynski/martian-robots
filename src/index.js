const { getData } = require("./data");
const { move } = require("./move");

(async () => {
  try {
    // load data
    const { grid, robots } = await getData();
    // execute instructions
    const output = move(grid, robots);
    // print formatted output
    output.forEach(robot =>
      console.log(
        robot.position[0],
        robot.position[1],
        robot.direction,
        robot.status
      )
    );
  } catch (e) {
    console.log(e);
  }
})();
