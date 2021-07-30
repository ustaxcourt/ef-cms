const { DynamoDB } = require('aws-sdk');
const { getVersion } = require('../util');

const environmentName = process.argv[2] || 'exp1';
const client = new DynamoDB({ region: 'us-east-1' });

const documents = [
  ['case|12826-20', 'docket-entry|fb1c441b-496b-4cb2-8998-316e46e0abc4', 'P'],
  ['case|13902-20', 'docket-entry|4ac7c5df-d72c-4984-bf3a-d4aef2635af1', 'P'],
  ['case|13957-20', 'docket-entry|0262fe8f-d775-4d3a-b284-bd2a6fa45323', 'B'],
  ['case|12762-20', 'docket-entry|c7475438-bb2d-4c42-8dec-c9bf408c410a', 'P'],
  ['case|13080-20', 'docket-entry|7c337c80-ed40-405f-848b-42a65331d043', 'P'],
  ['case|13079-20', 'docket-entry|fce4601c-8d2f-489a-aa07-3f66ca8c309c', 'P'],
  ['case|12829-20', 'docket-entry|17197772-c920-4987-bf11-b584cbd8f503', 'P'],
  ['case|13252-20', 'docket-entry|d338c3ac-5d34-4d2e-9163-830a1b8a114c', 'P'],
  ['case|13957-20', 'docket-entry|0ab9f0bb-1e80-4250-a264-bd8e0f08de1a', 'R'],
  ['case|13957-20', 'docket-entry|c003de58-fb0c-4700-88c1-80fd8d020c32', 'B'],
];

const updateDocument = async ({ pk, sk }) => {
  const version = await getVersion(environmentName);
  const query = {
    ExpressionAttributeValues: {
      ':val1': { S: 'B' },
    },
    Key: {
      pk: {
        S: pk,
      },
      sk: {
        S: sk,
      },
    },
    TableName: `efcms-${environmentName}-${version}`,
    UpdateExpression: 'SET servedPartiesCode = :val1',
  };
  await client.updateItem(query).promise();
};

const getDocument = async ({ pk, sk }) => {
  const version = await getVersion(environmentName);
  const query = {
    Key: {
      pk: {
        S: pk,
      },
      sk: {
        S: sk,
      },
    },
    TableName: `efcms-${environmentName}-${version}`,
  };
  const res = await client.getItem(query).promise();
  console.log(
    [
      res.Item.servedAt?.S,
      res.Item.docketNumber?.S,
      res.Item.index?.N,
      res.Item.filedBy?.S,
      res.Item.eventCode?.S,
      res.Item.servedPartiesCode?.S,
    ].join('\t'),
  );
};

(async () => {
  for (const doc of documents) {
    const [pk, sk] = doc;
    await getDocument({ pk, sk });
  }
})();
