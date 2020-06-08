const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(awsServerlessExpressMiddleware.eventContext());

const {
  createCourtIssuedOrderPdfFromHtmlLambda,
} = require('./courtIssuedOrder/createCourtIssuedOrderPdfFromHtmlLambda');
const {
  removeCasePendingItemLambda,
} = require('./cases/removeCasePendingItemLambda');
const {
  saveCaseDetailInternalEditLambda,
} = require('./cases/saveCaseDetailInternalEditLambda');
const { createCaseLambda } = require('./cases/createCaseLambda');
const { getCaseLambda } = require('./cases/getCaseLambda');
const { getNotificationsLambda } = require('./users/getNotificationsLambda');
const { swaggerJsonLambda } = require('./swagger/swaggerJsonLambda');
const { swaggerLambda } = require('./swagger/swaggerLambda');

app.get('/api/swagger', async (req, res) => {
  const { body, headers } = await swaggerLambda();
  res.set(headers);
  res.send(body);
});

app.get('/api/swagger.json', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {};
  const response = await swaggerJsonLambda(event);
  res.json(JSON.parse(response.body));
});

app.get('/cases/:caseId', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
    },
  };
  const response = await getCaseLambda(event);
  res.json(JSON.parse(response.body));
});

app.get('/api/notifications', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
  };
  const response = await getNotificationsLambda(event);
  res.json(JSON.parse(response.body));
});

app.post('/api/court-issued-order', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
  };
  const response = await createCourtIssuedOrderPdfFromHtmlLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.put('/cases/:caseId/', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: req.params,
  };
  const response = await saveCaseDetailInternalEditLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.delete('/cases/:caseId/remove-pending/:documentId', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: req.params,
  };
  const response = await removeCasePendingItemLambda({
    ...event,
  });
  res.json(JSON.parse(response.body));
});

app.post('/cases', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: req.params,
  };
  const response = await createCaseLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

exports.app = app;
