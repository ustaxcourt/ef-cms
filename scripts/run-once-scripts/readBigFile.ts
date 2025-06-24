import { createReadStream } from 'fs';
import readline from 'readline';

let scanCount = 0;
const rl = readline.createInterface({
  input: createReadStream(
    '/Users/zacharyrogers/Documents/allTestDynamoRecords.txt',
  ),
  crlfDelay: Infinity,
});

rl.on('line', line => {
  const obj = JSON.parse(line);
  if (
    obj.pk.startsWith('user|') &&
    obj.sk.startsWith('user|') &&
    typeof obj.birthYear == 'string'
  ) {
    console.log('obj', obj);
  }

  if (scanCount % 100000 === 0) {
    console.log('scanCount: ', scanCount);
  }

  scanCount++;
});

rl.on('close', () => {
  console.log('Done!');
});
