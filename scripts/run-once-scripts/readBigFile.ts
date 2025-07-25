import { createReadStream } from 'fs';
import readline from 'readline';
// import prodUsers from 'prodUsers.json';

let scanCount = 0;
const rl = readline.createInterface({
  input: createReadStream(
    '/Users/zacharyrogers/Documents/allTestDynamoRecords.txt',
  ),
  crlfDelay: Infinity,
});

rl.on('line', line => {
  const obj = JSON.parse(line);

  if (obj.pk.startsWith('user|') && obj.sk.startsWith('user')) {
    if (obj.contact?.email) {
      console.log(obj);
    }
  }
  if (obj.pk.startsWith('case|') && obj.sk.startsWith('irsPractitioner')) {
    if (obj.contact?.email) {
      console.log(obj);
    }
  }
  if (obj.pk.startsWith('case|') && obj.sk.startsWith('privatePractitioner')) {
    if (obj.contact?.email) {
      console.log(obj);
    }
  }

  if (scanCount % 100000 === 0) {
    console.log('scanCount: ', scanCount);
  }

  scanCount++;
});

rl.on('close', () => {
  // writeFileSync('prodUsers.json', JSON.stringify(data, null, 2));
  console.log('Done!');
});
