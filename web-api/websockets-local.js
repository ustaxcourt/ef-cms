/* eslint-disable @miovision/disallow-date/no-new-date */
const http = require('http');
const uuid = require('uuid').v4;
const WebSocketServer = require('websocket').server;

const { connectLambda } = require('./src/notifications/connectLambda');
const { disconnectLambda } = require('./src/notifications/disconnectLambda');

const connections = {};

const server = http.createServer(function (request, response) {
  let body = '';
  request.on('data', chunk => {
    body += chunk.toString();
  });
  request.on('end', () => {
    const split = request.url.split('/');
    const connectionId = split[split.length - 1];
    if (connections[connectionId]) {
      connections[connectionId].sendUTF(body);
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
  const queryStringParameters = Object.keys(request.resourceURL.query).reduce(
    (aggregatedValue, key) => {
      const value = request.resourceURL.query[key];
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
  connection.on('message', function (message) {
    if (message.utf8Data === 'ping') {
      connection.send(JSON.stringify({ data: { action: 'pong' } }));
    }
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
