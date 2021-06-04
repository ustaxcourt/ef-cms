const awsServerlessExpressMiddleware = require('@vendia/serverless-express/middleware');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const LimitStore = require('./limitStore');
const logger = require('./logger');
const slowDown = require('express-slow-down');
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

const requestsPerSecond = 7;
const windowSizeMillis = 10 * 1000; // 10 seconds

const searchKey = 'SEARCH_SPEED_LIMITER';
const searchSpeedLimiter = slowDown({
  ...{
    delayAfter: requestsPerSecond, // this many requests to go at full-speed, then...
    delayMs: 1000 / requestsPerSecond, // next request has a 100ms delay, 7th has a 200ms delay, 8th gets 300ms, etc.
    windowMs: windowSizeMillis,
  },
  keyGenerator: () => searchKey,
  store: new LimitStore({ key: searchKey, windowMs: windowSizeMillis }),
});

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
const { getHealthCheckLambda } = require('./health/getHealthCheckLambda');
const { getPublicCaseLambda } = require('./public-api/getPublicCaseLambda');
const { getPublicJudgesLambda } = require('./public-api/getPublicJudgesLambda');
const { todaysOpinionsLambda } = require('./public-api/todaysOpinionsLambda');
const { todaysOrdersLambda } = require('./public-api/todaysOrdersLambda');

const {
  opinionPublicSearchLambda,
} = require('./public-api/opinionPublicSearchLambda');
const {
  orderPublicSearchLambda,
} = require('./public-api/orderPublicSearchLambda');

/**
 * public-api
 */
app.get(
  '/public-api/search',
  searchSpeedLimiter,
  lambdaWrapper(casePublicSearchLambda),
);
app.get('/public-api/cases/:docketNumber', lambdaWrapper(getPublicCaseLambda));

app.get(
  '/public-api/order-search',
  searchSpeedLimiter,
  lambdaWrapper(orderPublicSearchLambda),
);
app.get(
  '/public-api/opinion-search',
  searchSpeedLimiter,
  lambdaWrapper(opinionPublicSearchLambda),
);

app.get(
  '/public-api/judges',
  searchSpeedLimiter,
  lambdaWrapper(getPublicJudgesLambda),
);

app.get(
  '/public-api/todays-opinions',
  searchSpeedLimiter,
  lambdaWrapper(todaysOpinionsLambda),
);
app.get(
  '/public-api/todays-orders/:page/:todaysOrdersSort',
  searchSpeedLimiter,
  lambdaWrapper(todaysOrdersLambda),
);

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
