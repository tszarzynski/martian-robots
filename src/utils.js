// utility function to compose functions
exports.compose = (...functions) => input =>
  functions.reduceRight(
    (chain, func) => chain.then(func),
    Promise.resolve(input)
  );

// circullar array traversing
exports.getFromArray = (arr, i) => {
  const len = arr.length;
  return arr[((i % len) + len) % len];
};

exports.print = (robots, withInstructions = false) =>
  robots.forEach(robot => {
    console.log(
      robot.position[0],
      robot.position[1],
      robot.direction,
      robot.status
    );
    if (withInstructions) console.log(robot.instructions.join(""));
  });
