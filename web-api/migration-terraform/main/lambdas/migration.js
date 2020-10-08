const AWS = require('aws-sdk');
const { get } = require('lodash');

const dynamodb = new AWS.DynamoDB({
  maxRetries: 10,
  retryDelayOptions: { base: 300 },
});

const documentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
  service: dynamodb,
});

const processItems = async items => {
  const promises = [];
  for (const item of items) {
    // TODO: your migration code would go here
    const result = documentClient
      .put({
        Item: item,
        TableName: process.env.DESTINATION_TABLE,
      })
      .promise();
    promises.push(result);
  }
  await Promise.all(promises);
};

exports.handler = async event => {
  const { Records } = event;
  const items = Records.filter(record => {
    // to prevent global tables writing extra data
    const NEW_TIME_KEY = 'dynamodb.NewImage.aws:rep:updatetime.N';
    const OLD_TIME_KEY = 'dynamodb.OldImage.aws:rep:updatetime.N';
    const newTime = get(record, NEW_TIME_KEY);
    const oldTime = get(record, OLD_TIME_KEY);
    return newTime && newTime !== oldTime;
  }).map(item => AWS.DynamoDB.Converter.unmarshall(item.dynamodb.NewImage));
  await processItems(items);
};
