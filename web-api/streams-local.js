const AWS = require('aws-sdk');
const { Writable } = require('stream');

const config = {
  credentials: {
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
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

  const { StreamDescription } = await dynamodbStreamsClient
    .describeStream({
      StreamArn: streamARN,
    })
    .promise();

  const processShard = shard => {
    const readable = DynamoDBReadable(dynamodbStreamsClient, streamARN, {
      ...config,
      iterator: 'TRIM_HORIZON',
      limit: 100,
      shardId: shard.shardId,
    });

    readable.pipe(
      new Writable({
        objectMode: true,
        write: (chunk, encoding, processNextChunk) => {
          processStreamRecordsLambda({
            Records: chunk,
          })
            .then(() => processNextChunk())
            .catch(err => {
              console.log('error', err);
            });
        },
      }),
    );
  };

  StreamDescription.Shards.forEach(shard => processShard(shard));
})();
