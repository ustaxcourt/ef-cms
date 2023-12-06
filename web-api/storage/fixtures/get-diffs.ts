const fs = require('fs');

const USAGE = `
Usage: node get-diffs.js path/to/efcms-before.json path/to/efcms-after.json > changes-present-in-afterfile.json

Try this:
npm run dynamo:export
mv storage/fixtures/efcms.json storage/fixtures/efcms-before.json

(now go create or alter your records with the UI)

npm run dynamo:export
mv storage/fixtures/efcms.json storage/fixtures/efcms-after.json
cd storage/fixtures/
node get-diffs.js efcms-before.json efcms-after.json > 107-19.json

Once done, you can halt the service and re-launch 'npm run seed:db', thus re-seeding the database.
`;

const files = [];
process.argv.forEach((val, index) => {
  if (index > 1) {
    files.push(val);
  }
});

/**
 * @arg obj1 {object}
 * @arg obj2 {object}
 * @returns {boolean} if objects are deep-equal
 */
function deepEqual(obj1, obj2) {
  //Loop through properties in object 1
  for (let p in obj1) {
    //Check property exists on both objects
    if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

    if (obj1[p] === null && obj2[p] !== null) return false;
    if (obj2[p] === null && obj1[p] !== null) return false;

    switch (typeof obj1[p]) {
      //Deep compare objects
      case 'object':
        if (!deepEqual(obj1[p], obj2[p])) return false;
        break;
      //Compare function code
      case 'function':
        if (
          typeof obj2[p] == 'undefined' ||
          (p != 'compare' && obj1[p].toString() != obj2[p].toString())
        )
          return false;
        break;
      //Compare values
      default:
        if (obj1[p] === '' && obj2[p] !== '') return false;
        if (obj2[p] === '' && obj1[p] !== '') return false;
        if (obj1[p] != obj2[p]) return false;
    }
  }

  //Check object 2 for any extra properties
  for (let q in obj2) {
    if (typeof obj1[q] == 'undefined') return false;
  }
  return true;
}

const collectionContainsSameRecord = (collection, record) => {
  const similarRecord = collection.find(el => {
    return el.pk == record.pk && el.sk == record.sk;
  });
  const sameRecordHasEquality =
    similarRecord && deepEqual(similarRecord, record);
  return sameRecordHasEquality;
};

const main = () => {
  if (files.length !== 2) {
    console.log(USAGE);
    return;
  }
  let original = JSON.parse(fs.readFileSync(files[0], 'utf8'));
  let updated = JSON.parse(fs.readFileSync(files[1], 'utf8'));

  if (original.length > updated.length) {
    console.warn('Original has more entries? Try reversing the arguments.');
  }

  let differences = updated.filter(
    el => !collectionContainsSameRecord(original, el),
  );
  // differences = differences.map(el => JSON.parse(el));
  console.log(JSON.stringify(differences, null, 2));
};

main();
