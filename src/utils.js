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
