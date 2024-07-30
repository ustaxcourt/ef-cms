import { server as WebSocketServer } from 'websocket';
import { connectLambda } from './lambdas/notifications/connectLambda';
import { disconnectLambda } from './lambdas/notifications/disconnectLambda';
import { app as localApiApp } from './app';
import { app as localPublicApiApp } from './app-public';
import { v4 as uuid } from 'uuid';
import http from 'http';

// ************************ app-local *********************************
const localApiPort = 4000;
localApiApp.listen(localApiPort);
console.log(`Listening on http://localhost:${localApiPort}`);

// ************************ app-public-local *********************************
const localPublicApiPort = 5000;

localPublicApiApp.listen(localPublicApiPort);
console.log(`Listening on http://localhost:${localPublicApiPort}`);

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
