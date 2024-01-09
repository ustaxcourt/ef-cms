import { createApplicationContext } from './applicationContext';
import { get } from './persistence/dynamodbClientService';
import { getCurrentInvoke } from '@vendia/serverless-express';
import { json, urlencoded } from 'body-parser';
import { lambdaWrapper } from './lambdaWrapper';
import { logger } from './logger';
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
app.use(logger());

import { advancedQueryLimiter } from './middleware/advancedQueryLimiter';
import { casePublicSearchLambda } from './lambdas/public-api/casePublicSearchLambda';
import { generatePublicDocketRecordPdfLambda } from './lambdas/public-api/generatePublicDocketRecordPdfLambda';
import { getAllFeatureFlagsLambda } from './lambdas/featureFlag/getAllFeatureFlagsLambda';
import { getCachedHealthCheckLambda } from '@web-api/lambdas/health/getCachedHealthCheckLambda';
import { getCaseForPublicDocketSearchLambda } from './lambdas/public-api/getCaseForPublicDocketSearchLambda';
import { getHealthCheckLambda } from './lambdas/health/getHealthCheckLambda';
import { getMaintenanceModeLambda } from './lambdas/maintenance/getMaintenanceModeLambda';
import { getPublicCaseExistsLambda } from './lambdas/public-api/getPublicCaseExistsLambda';
import { getPublicCaseLambda } from './lambdas/public-api/getPublicCaseLambda';
import { getPublicDocumentDownloadUrlLambda } from './lambdas/public-api/getPublicDocumentDownloadUrlLambda';
import { getPublicJudgesLambda } from './lambdas/public-api/getPublicJudgesLambda';
import { ipLimiter } from './middleware/ipLimiter';
import { opinionPublicSearchLambda } from './lambdas/public-api/opinionPublicSearchLambda';
import { orderPublicSearchLambda } from './lambdas/public-api/orderPublicSearchLambda';
import { resendVerificationLinkLambda } from '@web-api/lambdas/public-api/resendVerificationLinkLambda';
import { signUpUserLambda } from '@web-api/users/signUpUserLambda';
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

/**
 * Accounts
 */
{
  app.post('/public-api/account/create', lambdaWrapper(signUpUserLambda));
  app.post(
    '/account/resend-verification',
    lambdaWrapper(resendVerificationLinkLambda),
  );
}
