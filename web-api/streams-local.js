const AWS = require('aws-sdk');
const { Writable } = require('stream');

const config = {
  credentials: {
    accessKeyId: 'noop',
    secretAccessKey: 'noop',
  },
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
};
const dynamodbClient = new AWS.DynamoDB(config);
const dynamodbStreamsClient = new AWS.DynamoDBStreams(config);

const {
  processStreamRecordsLambda,
} = require('./src/streams/processStreamRecordsLambda');

const tableName = 'efcms-local';
const DynamoDBReadable = require('dynamodb-streams-readable');

(async () => {
  const streamARN = await dynamodbClient
    .describeTable({
      TableName: tableName,
    })
    .promise()
    .then(results => results.Table.LatestStreamArn);

  console.log('streamARN', streamARN);

  const { StreamDescription } = await dynamodbStreamsClient
    .describeStream({
      StreamArn: streamARN,
    })
    .promise();

  console.log(StreamDescription);

  const processShard = shard => {
    console.log('shard', shard);
    const readable = DynamoDBReadable(dynamodbStreamsClient, streamARN, {
      ...config,
      iterator: 'TRIM_HORIZON',
      limit: 100,
      shardId: shard.shardId,
    });

    readable.pipe(
      new Writable({
        objectMode: true,
        write: chunk => {
          processStreamRecordsLambda({
            Records: chunk,
          });
        },
      }),
    );
  };

  StreamDescription.Shards.forEach(shard => processShard(shard));
})();
