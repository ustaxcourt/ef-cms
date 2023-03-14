const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB({
  maxRetries: 10,
  region: 'us-east-1',
  retryDelayOptions: { base: 300 },
});

const dynamoDbDocumentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
  service: dynamodb,
});

const [segmentArg, totalSegmentsArg] = process.argv.slice(2);

const scanTableSegment = async (segment, totalSegments) => {
  let hasMoreResults = true;
  let lastKey = null;
  let items = [];
  while (hasMoreResults) {
    hasMoreResults = false;

    await dynamoDbDocumentClient
      .scan({
        ExclusiveStartKey: lastKey,
        Segment: segment,
        TableName: process.env.SOURCE_TABLE,
        TotalSegments: totalSegments,
      })
      .promise()
      .then(async results => {
        hasMoreResults = !!results.LastEvaluatedKey;
        lastKey = results.LastEvaluatedKey;
        items = [...items, ...results.Items];
      });
  }

  return items;
};

scanTableSegment(segmentArg, totalSegmentsArg).then(items => {
  console.log(items.length);
});
