import {
  DescribeStreamCommand,
  DynamoDBStreams,
} from '@aws-sdk/client-dynamodb-streams';
import { DescribeTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { server as WebSocketServer } from 'websocket';
import { Writable } from 'stream';
import { connectLambda } from './lambdas/notifications/connectLambda';
import { disconnectLambda } from './lambdas/notifications/disconnectLambda';
import { app as localApiApp } from './app';
import { app as localPublicApiApp } from './app-public';
import { processStreamRecordsLambda } from './lambdas/streams/processStreamRecordsLambda';
import { v4 as uuid } from 'uuid';
import DynamoDBReadable from 'dynamodb-streams-readable';
import express from 'express';
import http from 'http';

// ************************ app-local *********************************
const localApiPort = 4000;
localApiApp.listen(localApiPort);
console.log(`Listening on http://localhost:${localApiPort}`);

// ************************ app-public-local *********************************
const localPublicApiPort = 5000;

localPublicApiApp.listen(localPublicApiPort);
console.log(`Listening on http://localhost:${localPublicApiPort}`);

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
 * This endpoint it hit to know when the streams queue is empty.  An empty queue
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

// ************************ web-sockets-local *********************************
const connections = {};

const server = http.createServer((request, response) => {
  let requestBody = '';
  request.on('data', chunk => {
    requestBody += chunk.toString();
  });
  request.on('end', async () => {
    const split = request.url!.split('/');
    const connectionId = split[split.length - 1];
    if (connections[connectionId]) {
      connections[connectionId].sendUTF(requestBody);
      response.writeHead(200);
      return response.end();
    } else if (request.url?.includes('isDone')) {
      response.writeHead(200);
      return response.end();
    } else {
      response.writeHead(410);
      return response.end();
    }
  });
});

const PORT = 3011;

server.listen(PORT, function () {
  // eslint-disable-next-line @miovision/disallow-date/no-new-date
  console.log(new Date() + ` Server is listening on port ${PORT}`);
});

const wsServer = new WebSocketServer({
  autoAcceptConnections: false,
  httpServer: server,
});

wsServer.on('request', async function (request) {
  const connection = request.accept('echo-protocol', request.origin);
  const connectionId = uuid();
  connections[connectionId] = connection;
  const queryStringParameters = Object.keys(request.resourceURL.query!).reduce(
    (aggregatedValue, key) => {
      const value = request.resourceURL.query![key];
      aggregatedValue[key] = value;
      return aggregatedValue;
    },
    {},
  );
  await connectLambda({
    queryStringParameters,
    requestContext: {
      connectionId,
      domainName: `ws://localhost:${PORT}`,
    },
  });
  connection.on('close', async function () {
    delete connections[connectionId];

    await disconnectLambda({
      requestContext: {
        connectionId,
      },
    });
  });
});
