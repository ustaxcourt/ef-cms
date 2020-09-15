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
  for (let item of items) {
    await documentClient.put({
      Item: item,
      TableName: process.env.DESTINATION_TABLE,
    });
  }
};

exports.handler = async event => {
  const { Records } = event;
  const items = Records.filter(record => {
    // to prevent global tables writing extra data
    const NEW_TIME_KEY = 'dynamodb.NewImage.aws:rep:updatetime.N';
    const OLD_TIME_KEY = 'dynamodb.OldImage.aws:rep:updatetime.N';
    const newTime = get(NEW_TIME_KEY)(record);
    const oldTime = get(OLD_TIME_KEY)(record);
    return newTime && newTime !== oldTime;
  }).map(item => AWS.DynamoDB.Converter.unmarshall(item.dynamodb.NewImage));

  await processItems(items);
};
