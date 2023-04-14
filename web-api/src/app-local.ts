import { server as WebSocketServer } from 'websocket';
import { Writable } from 'stream';
import { connectLambda } from './notifications/connectLambda';
import { disconnectLambda } from './notifications/disconnectLambda';
import { app as localApiApp } from './app';
import { app as localPublicApiApp } from './app-public';
import { processStreamRecordsLambda } from './streams/processStreamRecordsLambda';
import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
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
  endpoint: process.env.DYNAMODB_ENDPOINT,
  region: 'us-east-1',
};

const localStreamsApp = express();
const dynamodbClient = new AWS.DynamoDB(config);
const dynamodbStreamsClient = new AWS.DynamoDBStreams(config);
const tableName = 'efcms-local';

let chunks = [];

/**
 * This endpoint it hit to know when the streams queue is empty.  An empty queue
 * means everything added to dynamo should have been indexed into elasticsearch.
 */
localStreamsApp.get('/isDone', (req, res) => {
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

localStreamsApp.listen(5005);

// ************************ websockets-local *********************************
const connections = {};

const server = http.createServer((request, response) => {
  let body = '';
  request.on('data', chunk => {
    body += chunk.toString();
  });
  request.on('end', () => {
    const split = request.url!.split('/');
    const connectionId = split[split.length - 1];
    if (connections[connectionId]) {
      connections[connectionId].sendUTF(body);
      response.writeHead(200);
      response.end();
    } else if (request.url?.includes('isDone')) {
      response.writeHead(200);
      response.end();
    } else {
      response.writeHead(410);
      response.end();
    }
  });
});

const PORT = 3011;

server.listen(PORT, function () {
  console.log(new Date() + ` Server is listening on port ${PORT}`);
});

const wsServer = new WebSocketServer({
  autoAcceptConnections: false,
  httpServer: server,
});

wsServer.on('request', function (request) {
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
  connectLambda({
    queryStringParameters,
    requestContext: {
      connectionId,
      domainName: `ws://localhost:${PORT}`,
    },
  });
  connection.on('close', function () {
    delete connections[connectionId];

    disconnectLambda({
      requestContext: {
        connectionId,
      },
    });
  });
});
