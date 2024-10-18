import {
  DescribeStreamCommand,
  DynamoDBStreams,
} from '@aws-sdk/client-dynamodb-streams';
import { DescribeTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Writable } from 'stream';
import { processStreamRecordsLambda } from './lambdas/streams/processStreamRecordsLambda';
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
const dynamodbClient = new DynamoDBClient(config);
const dynamodbStreamsClient = new DynamoDBStreams(config);
const TableName = 'efcms-local';

let chunks: any[] = [];

/**
 * This endpoint is hit to know when the streams queue is empty.  An empty queue
 * means everything added to dynamo should have been indexed into elasticsearch.
 */
localStreamsApp.get('/isDone', (req, res) => {
  res.send(chunks.length === 0);
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const describeTableResults = await dynamodbClient.send(
    new DescribeTableCommand({ TableName }),
  );
  const StreamArn = describeTableResults?.Table?.LatestStreamArn!;

  const { StreamDescription } = await dynamodbStreamsClient.send(
    new DescribeStreamCommand({ StreamArn }),
  );

  const processShard = shard => {
    const readable = DynamoDBReadable(dynamodbStreamsClient, StreamArn, {
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

  StreamDescription?.Shards?.forEach(shard => processShard(shard));
})();

const processChunks = async () => {
  for (const chunk of chunks) {
    // uncomment this if you want to try and fix
    // flaky cypress tests due to low latency
    // ES index.
    // await new Promise(resolve => setTimeout(resolve, 2000));
    await processStreamRecordsLambda({
      Records: chunk,
    }).catch(err => {
      console.log(err);
    });
  }
  chunks = [];

  setTimeout(processChunks, 1);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
processChunks();

localStreamsApp.listen(5005);
