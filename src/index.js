const { getData } = require("./data");
const { move } = require("./move");

(async () => {
  try {
    const { grid, robots } = await getData();
    const output = move(grid, robots);

    output.forEach(robot =>
      console.log(robot.position[0], robot.position[1], robot.direction)
    );
  } catch (e) {
    console.log(e);
  }
})();
