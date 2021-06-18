// this script is going to copy all of a case form one env to another

const crypto = require('crypto');
const fs = require('fs');
const { DynamoDB } = require('aws-sdk');
const { getVersion } = require('../util');
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const environmentName = process.argv[2] || 'exp1';
const action = process.argv[3] || 'putLocal';

const client = new DynamoDB({ region: 'us-east-1' });

const putItemLocal = async item => {
  await writeFile(`./data/${item.sk}`, JSON.stringify(item));
};

(async () => {
  const evaluateCaseInfo = async () => {
    const files = await readdir('./data');
    for (const f of files) {
      if (!f.includes('docket-entry')) continue;

      const record = await readFile(`./data/${f}`, 'UTF-8');
      const docketEntry = JSON.parse(record);
      if (!docketEntry.eventCode) {
        console.log(docketEntry);
      }
    }
  };
  const version = await getVersion(environmentName);
  console.log(version);

  const getCaseInfo = async ({ docketNumber, LastEvaluatedKey }) => {
    const query = {
      ExpressionAttributeNames: {
        '#pk': 'pk',
      },
      ExpressionAttributeValues: {
        ':pk': { S: `case|${docketNumber}` },
      },
      KeyConditionExpression: '#pk = :pk',
      TableName: `efcms-${environmentName}-${version}`,
    };

    if (LastEvaluatedKey) query.ExclusiveStartKey = LastEvaluatedKey;

    const data = await client.query(query).promise();
    const items = data.Items.map(item => DynamoDB.Converter.unmarshall(item));

    if (data.LastEvaluatedKey) {
      const moreItems = await getCaseInfo({
        LastEvaluatedKey: data.LastEvaluatedKey,
        docketNumber,
      });
      return items.concat(moreItems);
    }
    return items;
  };

  const findAndMockEmails = record => {
    if (record && typeof record === 'object') {
      const it = record.length ? record : Object.keys(record);

      for (const k of it) {
        if (k === 'email') {
          record[k] =
            crypto.createHash('md5').update(record[k]).digest('hex') +
            '@dawson.ustaxcourt.gov';
        } else {
          record[k] = findAndMockEmails(record[k]);
        }
      }
    }
    return record;
  };

  const putCaseInfo = async () => {
    const files = await readdir('./data');
    for (const f of files) {
      console.log(f);
      const record = await readFile(`./data/${f}`, 'UTF-8');
      await putCaseRecord(JSON.parse(record));
    }
    // console.log(files.length);
    // await Promise.all();
  };

  const putCaseRecord = async record => {
    if (environmentName === 'prod') {
      throw new Error('Cannot write to prod, sorry, not sorry');
    }
    record = findAndMockEmails(record);
    delete record['aws:rep:deleting'];
    delete record['aws:rep:updateregion'];
    delete record['aws:rep:updatetime'];
    const query = {
      Item: DynamoDB.Converter.marshall(record),
      ReturnConsumedCapacity: 'NONE',
      TableName: `efcms-${environmentName}-${version}`,
    };
    // console.log(query);
    await client.putItem(query).promise();
  };

  const moveDataToEnv = async ({ docketNumber }) => {
    const items = await getCaseInfo({ docketNumber });
    await Promise.all(items.map(item => putItemLocal(item)));
    evaluateCaseInfo({ docketNumber: '6944-11' });
  };

  switch (action) {
    case 'moveToEnv':
      await moveDataToEnv({ docketNumber: process.argv[4] });
      break;
    case 'putLocal':
    default:
      await putCaseInfo({ docketNumber: process.argv[4] });
      break;
  }
})();
