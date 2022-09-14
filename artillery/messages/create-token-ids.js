const fs = require('fs');

const tokens = fs.readFileSync('./tokens.csv', 'utf8').trim('\n').split('\n');
const ids = fs.readFileSync('./user-ids.csv', 'utf8').trim('\n').split('\n');

fs.writeFileSync('./token-ids.csv', '');

for (let i = 0; i < tokens.length; i++) {
  const token = tokens[i];
  const id = ids[i];
  fs.appendFileSync('./token-ids.csv', `${token},${id}\n`);
}
