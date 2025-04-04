import { createReadStream } from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: createReadStream('allTestDocketEntries.txt'),
  crlfDelay: Infinity,
});

rl.on('line', line => {
  const obj = JSON.parse(line);
  console.log('Got item:', obj);
});

rl.on('close', () => {
  console.log('Done!');
});
