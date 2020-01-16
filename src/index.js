const { getData } = require("./data");

(async () => {
  try {
    const data = await getData();
    console.log(data);
  } catch (e) {
    console.log(e);
  }
})();
