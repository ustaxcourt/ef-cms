const AWS = require('aws-sdk');
const { Writable } = require('stream');

const config = {
  credentials: {
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
  },
  endpoint: process.env.DYNAMODB_ENDPOINT,
  region: 'us-east-1',
};

const express = require('express');
const app = express();

const dynamodbClient = new AWS.DynamoDB(config);
const dynamodbStreamsClient = new AWS.DynamoDBStreams(config);

const {
  processStreamRecordsLambda,
} = require('./src/streams/processStreamRecordsLambda');

const tableName = 'efcms-local';
const DynamoDBReadable = require('dynamodb-streams-readable');

let chunks = [];

app.get('/isDone', (req, res) => {
  res.send(chunks.length === 0);
});

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
          chunks.push(chunk);
          processNextChunk();
        },
      }),
    );
  };

  StreamDescription.Shards.forEach(shard => processShard(shard));
})();

const processChunks = async () => {
  for (const chunk of chunks) {
    await processStreamRecordsLambda({
      Records: chunk,
    }).catch(err => {
      console.log(err);
    });
  }
  chunks = [];

  setTimeout(processChunks, 1);
};

processChunks();

app.listen(7777);
