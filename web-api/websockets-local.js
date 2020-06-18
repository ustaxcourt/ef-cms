const http = require('http');
const uuid = require('uuid').v4;
const WebSocketServer = require('websocket').server;

const { connectLambda } = require('./src/notifications/connectLambda');
const { disconnectLambda } = require('./src/notifications/disconnectLambda');

const server = http.createServer(function (request, response) {
  console.log(new Date() + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(8080, function () {
  console.log(new Date() + ' Server is listening on port 8080');
});

const wsServer = new WebSocketServer({
  autoAcceptConnections: false,
  httpServer: server,
});

wsServer.on('request', function (request) {
  const connection = request.accept('echo-protocol', request.origin);
  const reqestId = uuid();
  connectLambda({
    requestContext: {
      domainName: 'ws:localhost:8080',
      reqestId,
    },
  });
  connection.on('message', function () {});
  connection.on('close', function () {
    disconnectLambda({
      requestContext: {
        reqestId,
      },
    });
  });
});
