import { applicationContext } from './applicationContext';
import { requestLogger } from './logger';
import { get } from './persistence/dynamodbClientService';
import { getCurrentInvoke } from '@vendia/serverless-express';
import { lambdaWrapper } from './lambdaWrapper';
import { set } from 'lodash';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

export const app = new Hono();

app.use('*', cors());

app.use('*', async (_c, next) => {
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
  await next();
});
app.use('*', async (c, next) => {
  /**
   * This environment variable is set to true by default on deployment of the API lambdas
   * to prevent traffic from hitting the deploying color during deployment.
   * It is also set to true on the newly-passive color at the end of a deployment as we switch colors
   * to prevent traffic to the inactive color.
   */
  const shouldForceRefresh =
    process.env.DISABLE_HTTP_TRAFFIC === 'true' && !c.req.header('x-test-user');

  if (shouldForceRefresh) {
    c.header('X-Force-Refresh', 'true');
    c.header('Access-Control-Expose-Headers', 'X-Force-Refresh');
    return c.text('this api is disabled due to a deployment', 500);
  }

  await next();
});
app.use('*', requestLogger);

import { casePublicSearchLambda } from './lambdas/public-api/casePublicSearchLambda';
import { generatePublicDocketRecordPdfLambda } from './lambdas/public-api/generatePublicDocketRecordPdfLambda';
import { getAllFeatureFlagsLambda } from './lambdas/featureFlag/getAllFeatureFlagsLambda';
import { getHealthCheckLambda } from './lambdas/health/getHealthCheckLambda';
import { getMaintenanceModeLambda } from './lambdas/maintenance/getMaintenanceModeLambda';
import { getPractitionerByBarNumberLambda } from '@web-api/lambdas/practitioners/getPractitionerByBarNumberLambda';
import { getPractitionersByNameLambda } from '@web-api/lambdas/practitioners/getPractitionersByNameLambda';
import { getPublicCaseExistsLambda } from './lambdas/public-api/getPublicCaseExistsLambda';
import { getPublicCaseLambda } from '@web-api/lambdas/public-api/getPublicCaseLambda';
import { getPublicDocumentDownloadUrlLambda } from './lambdas/public-api/getPublicDocumentDownloadUrlLambda';
import { getPublicJudgesLambda } from './lambdas/public-api/getPublicJudgesLambda';
import { getPublicTrialSessionDetailsLambda } from '@web-api/lambdas/public-api/getPublicTrialSessionDetailsLambda';
import { getPublicTrialSessionsLambda } from '@web-api/lambdas/trialSessions/getPublicTrialSessionsLambda';
import { getUsersInSectionLambda } from '@web-api/lambdas/users/getUsersInSectionLambda';
import { opinionPublicSearchLambda } from './lambdas/public-api/opinionPublicSearchLambda';
import { orderPublicSearchLambda } from './lambdas/public-api/orderPublicSearchLambda';
import { todaysOpinionsLambda } from './lambdas/public-api/todaysOpinionsLambda';
import { todaysOrdersLambda } from './lambdas/public-api/todaysOrdersLambda';

/** Case */
{
  app.on(
    'HEAD',
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
  app.get('/public-api/order-search', lambdaWrapper(orderPublicSearchLambda));
  app.get(
    '/public-api/opinion-search',
    lambdaWrapper(opinionPublicSearchLambda),
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
    '/public-api/maintenance-mode',
    lambdaWrapper(getMaintenanceModeLambda),
  );
}

/**
 * Trial sessions
 */
{
  app.get(
    '/public-api/trial-sessions',
    lambdaWrapper(getPublicTrialSessionsLambda),
  );
  app.get(
    '/public-api/sections/:section/users',
    lambdaWrapper(getUsersInSectionLambda),
  );
  app.get(
    '/public-api/trial-sessions/:trialSessionId',
    lambdaWrapper(getPublicTrialSessionDetailsLambda),
  );
}

/**
 * Feature flags
 */
{
  app.get('/system/feature-flag', lambdaWrapper(getAllFeatureFlagsLambda));
}
