const fs = require('fs');
const path = require('path');

function loadTsConfig(relativePath) {
  const configPath = path.resolve(__dirname, '..', relativePath);
  const configFile = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(configFile);
}

module.exports = loadTsConfig;