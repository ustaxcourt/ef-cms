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

const {
  createCaseDeadlineLambda,
} = require('./caseDeadline/createCaseDeadlineLambda');
const {
  createCourtIssuedOrderPdfFromHtmlLambda,
} = require('./courtIssuedOrder/createCourtIssuedOrderPdfFromHtmlLambda');
const {
  deleteCaseDeadlineLambda,
} = require('./caseDeadline/deleteCaseDeadlineLambda');
const {
  generateDocketRecordPdfLambda,
} = require('./cases/generateDocketRecordPdfLambda');
const {
  getAllCaseDeadlinesLambda,
} = require('./caseDeadline/getAllCaseDeadlinesLambda');
const {
  getCaseDeadlinesForCaseLambda,
} = require('./caseDeadline/getCaseDeadlinesForCaseLambda');
const {
  updateCaseDeadlineLambda,
} = require('./caseDeadline/updateCaseDeadlineLambda');
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

app.post('/api/docket-record-pdf', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
  };
  const response = await generateDocketRecordPdfLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.post('/case-deadlines/:caseId', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
    },
  };
  const response = await createCaseDeadlineLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.get('/case-deadlines/:caseId', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
    },
  };
  const response = await getCaseDeadlinesForCaseLambda({
    ...event,
  });
  res.json(JSON.parse(response.body));
});

app.put('/case-deadlines/:caseId/:caseDeadlineId', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseDeadlineId: req.params.caseDeadlineId,
      caseId: req.params.caseId,
    },
  };
  const response = await updateCaseDeadlineLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.delete('/case-deadlines/:caseId/:caseDeadlineId', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseDeadlineId: req.params.caseDeadlineId,
      caseId: req.params.caseId,
    },
  };
  const response = await deleteCaseDeadlineLambda({
    ...event,
  });
  res.json(JSON.parse(response.body));
});

app.get('/case-deadlines', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
  };
  const response = await getAllCaseDeadlinesLambda({
    ...event,
  });
  res.json(JSON.parse(response.body));
});

exports.app = app;
