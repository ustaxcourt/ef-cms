const path = require("path");
const fs = require("fs");

module.exports = function dotenvJSON(options) {
  const jsonFile = (options && options.path) || ".env.json";

  const jsonString = fs.readFileSync(path.resolve(process.cwd(), jsonFile), {
    encoding: "utf8"
  });

  try {
    const envConfig = JSON.parse(jsonString);

    for (const key in envConfig) {
      process.env[key] = process.env[key] || envConfig[key];
    }
  } catch (err) {
    console.error(err);
  }
};
