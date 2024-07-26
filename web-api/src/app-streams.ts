import { Writable } from 'stream';
import { debounce } from 'lodash';
import { processStreamRecordsLambda } from './lambdas/streams/processStreamRecordsLambda';
import AWS from 'aws-sdk';
import DynamoDBReadable from 'dynamodb-streams-readable';
import express from 'express';

// ************************ streams-local *********************************
const config = {
  credentials: {
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
  },
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
};

const localStreamsApp = express();
const dynamodbClient = new AWS.DynamoDB(config);
const dynamodbStreamsClient = new AWS.DynamoDBStreams(config);
const tableName = 'efcms-local';
let isDone = true;

// if a lot of events are being slow to process, we'll keep deboucing until they all finish
const setIsDone = debounce(() => {
  isDone = true;
}, 2000);

/**
 * This endpoint it hit to know when the streams queue is empty.  An empty queue
 * means everything added to dynamo should have been indexed into elasticsearch.
 */
localStreamsApp.get('/isDone', (req, res) => {
  res.send(isDone);
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const streamARN = await dynamodbClient
    .describeTable({
      TableName: tableName,
    })
    .promise()
    .then(results => results?.Table?.LatestStreamArn!);

  const { StreamDescription } = await dynamodbStreamsClient
    .describeStream({
      StreamArn: streamARN,
    })
    .promise();

  StreamDescription?.Shards?.forEach(shard => {
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
          isDone = false;
          processStreamRecordsLambda({
            Records: chunk,
          })
            .then(processNextChunk)
            .then(setIsDone)
            .catch(err => {
              console.log(err);
            });
        },
      }),
    );
  });
})();

localStreamsApp.listen(5005);
