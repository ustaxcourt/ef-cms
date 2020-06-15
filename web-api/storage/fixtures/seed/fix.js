const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const files = [
  './101-19.json',
  './101-20.json',
  './102-19.json',
  './102-20.json',
  './103-19.json',
  './103-20.json',
  './104-19.json',
  './105-19.json',
  './106-19.json',
  './107-19.json',
  './108-19.json',
  './109-19.json',
  './110-19.json',
  './111-19.json',
  './112-19.json',
  './113-19.json',
];

for (const file of files) {
  // eslint-disable-next-line security/detect-non-literal-require
  let json = require(file);
  const items = [];
  for (const item of json) {
    items.push(item);
    if (item.docketRecord) {
      item.docketRecord.forEach(record => {
        let docketRecordId = uuidv4();
        items.push({
          ...record,
          docketRecordId,
          pk: `case|${item.caseId}`,
          sk: `docket-record|${docketRecordId}`,
        });
      });
      delete item.docketRecord;
    }
  }
  fs.writeFileSync(file, JSON.stringify(items, null, 2));
}
