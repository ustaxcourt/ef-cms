/* eslint-disable complexity */
import { createReadStream } from 'fs';
import readline from 'readline';
import prodUsers from 'prodUsers.json';

let scanCount = 0;
const rl = readline.createInterface({
  input: createReadStream(
    '/Users/zacharyrogers/Documents/allTestDynamoRecords.txt',
  ),
  crlfDelay: Infinity,
});

// const data = {} as any;

rl.on('line', line => {
  const obj = JSON.parse(line);

  // if (obj.sk.startsWith('user|') && obj.pk.startsWith('user|')) {
  //   data[obj.userId] = obj;
  // }

  if (
    (obj.sk.startsWith('irsPractitioner|') && obj.pk.startsWith('case|')) ||
    (obj.sk.startsWith('privatePractitioner|') && obj.pk.startsWith('case|')) ||
    (obj.sk.startsWith('inactivePractitioner|') && obj.pk.startsWith('case|'))
  ) {
    const userUserEntry = prodUsers[obj.userId];
    // delete userUserEntry.pk;
    // delete userUserEntry.sk;

    // delete obj.pk;
    // delete obj.sk;

    // if (!isEqual(userUserEntry.contact, obj.contact)) {
    //   console.log('userUserEntry!: ', userUserEntry.contact);
    //   console.log('caseUserEntry!: ', obj.contact);
    // }
    if (
      userUserEntry?.contact?.city !== obj?.contact?.city &&
      !userUserEntry?.email?.includes('irsPractitioner') &&
      !userUserEntry?.firmName
        ?.toLowerCase()
        .includes('united states tax court') &&
      userUserEntry?.role != 'irsPractitioner'
    ) {
      // console.log('userUserEntry.contact', userUserEntry);
      console.log('userUserEntry!: ', userUserEntry);
      console.log('caseUserEntry!: ', obj);
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
