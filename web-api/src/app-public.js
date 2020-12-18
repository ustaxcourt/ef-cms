const awsServerlessExpressMiddleware = require('@vendia/serverless-express/middleware');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const logger = require('./logger');
const { lambdaWrapper } = require('./lambdaWrapper');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    // we added this to suppress error `Missing x-apigateway-event or x-apigateway-context header(s)` locally
    // aws-serverless-express/middleware plugin is looking for these headers, which are needed on the lambdas
    req.headers['x-apigateway-event'] = 'null';
    req.headers['x-apigateway-context'] = 'null';
  }
  return next();
});
app.use(awsServerlessExpressMiddleware.eventContext());
app.use(logger());

const {
  casePublicSearchLambda,
} = require('./public-api/casePublicSearchLambda');
const {
  generatePublicDocketRecordPdfLambda,
} = require('./public-api/generatePublicDocketRecordPdfLambda');
const {
  getCaseForPublicDocketSearchLambda,
} = require('./public-api/getCaseForPublicDocketSearchLambda');
const {
  getPublicDocumentDownloadUrlLambda,
} = require('./public-api/getPublicDocumentDownloadUrlLambda');
const {
  opinionPublicSearchLambda,
} = require('./public-api/opinionPublicSearchLambda');
const {
  orderPublicSearchLambda,
} = require('./public-api/orderPublicSearchLambda');
const { getHealthCheckLambda } = require('./health/getHealthCheckLambda');
const { getPublicCaseLambda } = require('./public-api/getPublicCaseLambda');
const { getPublicJudgesLambda } = require('./public-api/getPublicJudgesLambda');
const { todaysOpinionsLambda } = require('./public-api/todaysOpinionsLambda');

/**
 * public-api
 */
app.get('/public-api/search', lambdaWrapper(casePublicSearchLambda));
app.get('/public-api/cases/:docketNumber', lambdaWrapper(getPublicCaseLambda));
app.get('/public-api/order-search', lambdaWrapper(orderPublicSearchLambda));
app.get('/public-api/opinion-search', lambdaWrapper(opinionPublicSearchLambda));
app.get('/public-api/judges', lambdaWrapper(getPublicJudgesLambda));
app.get('/public-api/todays-opinions', lambdaWrapper(todaysOpinionsLambda));
app.get(
  '/public-api/docket-number-search/:docketNumber',
  lambdaWrapper(getCaseForPublicDocketSearchLambda),
);
app.post(
  '/public-api/cases/:docketNumber/generate-docket-record',
  lambdaWrapper(generatePublicDocketRecordPdfLambda),
);
app.get(
  '/public-api/:docketNumber/:key/public-document-download-url',
  lambdaWrapper(getPublicDocumentDownloadUrlLambda),
);
app.get('/public-api/health', lambdaWrapper(getHealthCheckLambda));

exports.app = app;
