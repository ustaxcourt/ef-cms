const cors = require('cors');
const createApplicationContext = require('./applicationContext');
const express = require('express');
const logger = require('./logger');
const { json, urlencoded } = require('body-parser');
const { lambdaWrapper } = require('./lambdaWrapper');
const app = express();
const { getCurrentInvoke } = require('@vendia/serverless-express');
const { set } = require('lodash');

const applicationContext = createApplicationContext();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    // we added this to suppress error `Missing x-apigateway-event or x-apigateway-context header(s)` locally
    // aws-serverless-express/middleware plugin is looking for these headers, which are needed on the lambdas
    req.headers['x-apigateway-event'] = 'null';
    req.headers['x-apigateway-context'] = 'null';
  }
  return next();
});
app.use(async (req, res, next) => {
  // This code is here so that we have a way to mock out the terminal user
  // via using dynamo locally.  This is only ran locally and on CI/CD which is
  // why we also lazy require some of these packages.  See story 8955 for more info.
  if (process.env.NODE_ENV !== 'production') {
    const currentInvoke = getCurrentInvoke();
    set(currentInvoke, 'event.requestContext.identity.sourceIp', 'localhost');
    const {
      get,
    } = require('../../shared/src/persistence/dynamodbClientService.js');
    const whitelist = await get({
      Key: {
        pk: 'allowed-terminal-ips',
        sk: 'allowed-terminal-ips',
      },
      applicationContext,
    });
    const ips = whitelist?.ips ?? [];

    if (ips.includes('localhost')) {
      set(
        currentInvoke,
        'event.requestContext.authorizer.isTerminalUser',
        'true',
      );
    }
  }
  return next();
});
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
  getFeatureFlagValueLambda,
} = require('./featureFlag/getFeatureFlagValueLambda');
const {
  getMaintenanceModeLambda,
} = require('./maintenance/getMaintenanceModeLambda');
const {
  getPublicCaseExistsLambda,
} = require('./public-api/getPublicCaseExistsLambda');
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
const { advancedQueryLimiter } = require('./middleware/advancedQueryLimiter');
const { ipLimiter } = require('./middleware/ipLimiter');

/**
 * public-api
 */
app.get('/public-api/search', lambdaWrapper(casePublicSearchLambda));
app.head(
  '/public-api/cases/:docketNumber',
  lambdaWrapper(getPublicCaseExistsLambda),
);
app.get('/public-api/cases/:docketNumber', lambdaWrapper(getPublicCaseLambda));

app.get(
  '/public-api/order-search',
  ipLimiter({
    applicationContext,
    key: applicationContext.getConstants().ADVANCED_DOCUMENT_IP_LIMITER_KEY,
  }),
  advancedQueryLimiter({
    applicationContext,
    key: applicationContext.getConstants().ADVANCED_DOCUMENT_LIMITER_KEY,
  }),
  lambdaWrapper(orderPublicSearchLambda),
);

app.get(
  '/public-api/opinion-search',
  ipLimiter({
    applicationContext,
    key: applicationContext.getConstants().ADVANCED_DOCUMENT_IP_LIMITER_KEY,
  }),
  advancedQueryLimiter({
    applicationContext,
    key: applicationContext.getConstants().ADVANCED_DOCUMENT_LIMITER_KEY,
  }),
  lambdaWrapper(opinionPublicSearchLambda),
);

app.get('/public-api/judges', lambdaWrapper(getPublicJudgesLambda));

app.get('/public-api/todays-opinions', lambdaWrapper(todaysOpinionsLambda));
app.get(
  '/public-api/todays-orders/:page/:todaysOrdersSort',
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

app.get(
  '/public-api/maintenance-mode',
  lambdaWrapper(getMaintenanceModeLambda),
);

app.get('/feature-flag/:featureFlag', lambdaWrapper(getFeatureFlagValueLambda));

exports.app = app;
