import { createReadStream } from 'fs';
import readline from 'readline';

const uniqueKeysMap: Map<string, number> = new Map();

const rl = readline.createInterface({
  input: createReadStream('allTestDocketEntries.txt'),
  crlfDelay: Infinity,
});

rl.on('line', line => {
  const obj = JSON.parse(line);
  Object.keys(obj).forEach(key => {
    const currentCount = uniqueKeysMap.get(key) || 0;
    uniqueKeysMap.set(key, currentCount + 1);
  });
});

rl.on('close', () => {
  console.log('Done!');
  console.log(uniqueKeysMap);
});
