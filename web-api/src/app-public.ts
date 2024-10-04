import { createApplicationContext } from './applicationContext';
import { expressLogger } from './logger';
import { get } from './persistence/dynamodbClientService';
import { getCurrentInvoke } from '@vendia/serverless-express';
import { json, urlencoded } from 'body-parser';
import { lambdaWrapper } from './lambdaWrapper';
import { set } from 'lodash';
import cors from 'cors';
import express from 'express';

export const app = express();

const applicationContext = createApplicationContext({});

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
    const allowlist = await get({
      Key: {
        pk: 'allowed-terminal-ips',
        sk: 'allowed-terminal-ips',
      },
      applicationContext,
    });
    const ips = allowlist?.ips ?? [];

    set(
      currentInvoke,
      'event.requestContext.authorizer.isTerminalUser',
      ips.includes('localhost') ? 'true' : 'false',
    );
  }
  return next();
});
app.use((req, res, next) => {
  /**
   * This environment variable is set to true by default on deployment of the API lambdas
   * to prevent traffic from hitting the deploying color during deployment.
   * It is also set to true on the newly-passive color at the end of a deployment as we switch colors
   * to prevent traffic to the inactive color.
   */
  const shouldForceRefresh =
    process.env.DISABLE_HTTP_TRAFFIC === 'true' && !req.headers['x-test-user'];

  if (shouldForceRefresh) {
    res.set('X-Force-Refresh', 'true');
    res.set('Access-Control-Expose-Headers', 'X-Force-Refresh');
    res.status(500).send('this api is disabled due to a deployment');
    return;
  }

  next();
});
app.use(expressLogger);

import { advancedQueryLimiter } from './middleware/advancedQueryLimiter';
import { casePublicSearchLambda } from './lambdas/public-api/casePublicSearchLambda';
import { generatePublicDocketRecordPdfLambda } from './lambdas/public-api/generatePublicDocketRecordPdfLambda';
import { getAllFeatureFlagsLambda } from './lambdas/featureFlag/getAllFeatureFlagsLambda';
import { getCachedHealthCheckLambda } from '@web-api/lambdas/health/getCachedHealthCheckLambda';
import { getCaseForPublicDocketSearchLambda } from './lambdas/public-api/getCaseForPublicDocketSearchLambda';
import { getHealthCheckLambda } from './lambdas/health/getHealthCheckLambda';
import { getMaintenanceModeLambda } from './lambdas/maintenance/getMaintenanceModeLambda';
import { getPractitionerByBarNumberLambda } from '@web-api/lambdas/practitioners/getPractitionerByBarNumberLambda';
import { getPractitionersByNameLambda } from '@web-api/lambdas/practitioners/getPractitionersByNameLambda';
import { getPublicCaseExistsLambda } from './lambdas/public-api/getPublicCaseExistsLambda';
import { getPublicCaseLambda } from './lambdas/public-api/getPublicCaseLambda';
import { getPublicDocumentDownloadUrlLambda } from './lambdas/public-api/getPublicDocumentDownloadUrlLambda';
import { getPublicJudgesLambda } from './lambdas/public-api/getPublicJudgesLambda';
import { ipLimiter } from './middleware/ipLimiter';
import { opinionPublicSearchLambda } from './lambdas/public-api/opinionPublicSearchLambda';
import { orderPublicSearchLambda } from './lambdas/public-api/orderPublicSearchLambda';
import { todaysOpinionsLambda } from './lambdas/public-api/todaysOpinionsLambda';
import { todaysOrdersLambda } from './lambdas/public-api/todaysOrdersLambda';

/** Case */
{
  app.head(
    '/public-api/cases/:docketNumber',
    lambdaWrapper(getPublicCaseExistsLambda),
  );
  app.get(
    '/public-api/cases/:docketNumber',
    lambdaWrapper(getPublicCaseLambda),
  );
  app.get(
    '/public-api/:docketNumber/:key/public-document-download-url',
    lambdaWrapper(getPublicDocumentDownloadUrlLambda),
  );
  app.post(
    '/public-api/cases/:docketNumber/generate-docket-record',
    lambdaWrapper(generatePublicDocketRecordPdfLambda),
  );
}

app.get('/public-api/judges', lambdaWrapper(getPublicJudgesLambda));

/**
 * Reports
 */
{
  app.get('/public-api/todays-opinions', lambdaWrapper(todaysOpinionsLambda));
  app.get(
    '/public-api/todays-orders/:page/:todaysOrdersSort',
    lambdaWrapper(todaysOrdersLambda),
  );
}

/** Search */
{
  app.get('/public-api/search', lambdaWrapper(casePublicSearchLambda));
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
  app.get(
    '/public-api/docket-number-search/:docketNumber',
    lambdaWrapper(getCaseForPublicDocketSearchLambda),
  );
  app.get(
    '/public-api/practitioners',
    lambdaWrapper(getPractitionersByNameLambda),
  );
  app.get(
    '/public-api/practitioners/:barNumber',
    lambdaWrapper(getPractitionerByBarNumberLambda),
  );
}

/**
 * Application Health
 */
{
  app.get('/public-api/health', lambdaWrapper(getHealthCheckLambda));
  app.get(
    '/public-api/cached-health',
    lambdaWrapper(getCachedHealthCheckLambda),
  );
  app.get(
    '/public-api/maintenance-mode',
    lambdaWrapper(getMaintenanceModeLambda),
  );
}

/**
 * Feature flags
 */
{
  app.get('/system/feature-flag', lambdaWrapper(getAllFeatureFlagsLambda));
}
