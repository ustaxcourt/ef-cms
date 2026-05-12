import { expressLogger } from './logger';
import { getCurrentInvoke } from '@codegenie/serverless-express';
import { json, urlencoded } from 'body-parser';
import { lambdaWrapper } from './lambdaWrapper';
import { set } from 'lodash';
import cors from 'cors';
import express from 'express';
import qs from 'qs';

export const app = express();

// We explicitly use qs as our query parser: it was the default in express 4.x.,
// but was no longer the default in express 5.x, so we need to explicitly set it
// here. See https://github.com/ustaxcourt/ef-cms/pull/6020
//
// By default, qs limits arrays to a maximum of 20:
//
// > qs will also limit arrays to a maximum of 20 elements. Any array members
// > with an index of 20 or greater will instead be converted to an object with
// > the index as the key. This is needed to handle cases when someone sent,
// > for example, a[999999999] and it will take significant time to iterate over
// > this huge array. (https://www.npmjs.com/package/qs)
//
// Some API requests involve more than 20 query string parameters by necessity
// due to the number of judges (for example, searching for all judges using
// getPendingMotionDocketEntriesForCurrentJudgeInteractor). Here we set the
// array length to 200 to prohibit DoS attacks, while at the same time
// accommodating cases when we need to pass more than 20 items in an array as
// query string parameters.
app.set('query parser', str => qs.parse(str, { arrayLimit: 200 }));

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use((req, _res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    // we added this to suppress error `Missing x-apigateway-event or x-apigateway-context header(s)` locally
    // aws-serverless-express/middleware plugin is looking for these headers, which are needed on the lambdas
    req.headers['x-apigateway-event'] = 'null';
    req.headers['x-apigateway-context'] = 'null';
  }
  return next();
});
app.use(async (_req, _res, next) => {
  // This code is here so that we have a way to mock out the terminal user.
  // This is only ran locally and on CI/CD which is
  // why we also lazy require some of these packages.  See story 8955 for more info.
  if (process.env.NODE_ENV !== 'production') {
    const currentInvoke = getCurrentInvoke();
    set(currentInvoke, 'event.requestContext.identity.sourceIp', 'localhost');

    const [IPS_RECORD] = await getDbReader(reader =>
      reader
        .selectFrom('dwFeatureFlag')
        .select(['value'])
        .where('name', '=', 'allowed-terminal-ips')
        .execute(),
    );

    const IPS = IPS_RECORD ? (IPS_RECORD.value.current as string[]) : [];

    set(
      currentInvoke,
      'event.requestContext.authorizer.isTerminalUser',
      IPS.includes('localhost') ? 'true' : 'false',
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

  const readOnlyPosts = [
    '/public-api/search',
    '/public-api/order-search',
    '/public-api/opinion-search',
  ];

  if (
    process.env.READ_ONLY_MODE === 'true' &&
    req.method !== 'GET' &&
    req.method !== 'OPTIONS' &&
    !(
      req.method === 'POST' &&
      readOnlyPosts.some(route => req.url.startsWith(route))
    )
  ) {
    res
      .status(503)
      .send('System is upgrading. Please wait a few minutes and try again.');
    return;
  }

  next();
});

app.use(expressLogger);

import { casePublicSearchLambda } from './lambdas/public-api/casePublicSearchLambda';
import { generatePublicDocketRecordPdfLambda } from './lambdas/public-api/generatePublicDocketRecordPdfLambda';
import { getPublicDocketRecordStatusLambda } from './lambdas/public-api/getPublicDocketRecordStatusLambda';
import { getAllFeatureFlagsLambda } from './lambdas/featureFlag/getAllFeatureFlagsLambda';
import { getHealthCheckLambda } from './lambdas/health/getHealthCheckLambda';
import { getMaintenanceModeLambda } from './lambdas/maintenance/getMaintenanceModeLambda';
import { getPractitionerByBarNumberLambda } from '@web-api/lambdas/practitioners/getPractitionerByBarNumberLambda';
import { getPractitionersByNameLambda } from '@web-api/lambdas/practitioners/getPractitionersByNameLambda';
import { getPublicCaseExistsLambda } from './lambdas/public-api/getPublicCaseExistsLambda';
import { getPublicCaseDocketEntriesLambda } from '@web-api/lambdas/public-api/getPublicCaseDocketEntriesLambda';
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
import { verifyUserPendingEmailLambda } from './lambdas/public-api/verifyUserPendingEmailLambda';
import { getDbReader } from '@web-api/persistence/postgres/database';

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
    '/public-api/cases/:docketNumber/docket-entries',
    lambdaWrapper(getPublicCaseDocketEntriesLambda),
  );
  app.get(
    '/public-api/:docketNumber/:key/public-document-download-url',
    lambdaWrapper(getPublicDocumentDownloadUrlLambda),
  );
  app.post(
    '/public-api/cases/:docketNumber/generate-docket-record',
    lambdaWrapper(generatePublicDocketRecordPdfLambda),
  );
  app.get(
    '/public-api/docket-record-status/:jobId',
    lambdaWrapper(getPublicDocketRecordStatusLambda),
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

/**
 * Email verification
 */
{
  app.put(
    '/public-api/verify-email',
    lambdaWrapper(verifyUserPendingEmailLambda),
  );
}
