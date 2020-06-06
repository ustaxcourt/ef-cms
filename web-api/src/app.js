const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const app = express();

console.log('we are here');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(awsServerlessExpressMiddleware.eventContext());

app.post('/', (req, res) => {
  console.log(req.apiGateway);
  console.log(req.body);
  res.json({
    message: 'hi',
  });
});

app.get('/test', (req, res) => {
  console.log('testing');
  console.log(req.apiGateway);
  console.log(req.body);
  res.json({
    message: 'hi',
  });
});

exports.app = app;
