const fs = require('fs');

fs.writeFileSync('./user-ids.csv', '');

const tokens = fs.readFileSync('./tokens.csv', 'utf8').trim('\n').split('\n');
for (const token of tokens) {
  const [, payload] = token.split('.');
  const userId = JSON.parse(
    Buffer.from(payload, 'base64').toString('utf8'),
  ).sub;
  console.log(userId);
  fs.appendFileSync('./user-ids.csv', `${userId}\n`);
}
