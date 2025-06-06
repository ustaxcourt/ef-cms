import { expressLogger } from './logger';
import { getCurrentInvoke } from '@vendia/serverless-express';
import { json, urlencoded } from 'body-parser';
import { lambdaWrapper } from './lambdaWrapper';
import { set } from 'lodash';
import cors from 'cors';
import express from 'express';

export const app = express();

// This was default in express 4.x. The default changed in express 5.x, so we have to specify it here
app.set('query parser', 'extended');

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
  // This code is here so that we have a way to mock out the terminal user
  // via using dynamo locally.  This is only ran locally and on CI/CD which is
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
app.use(expressLogger);

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
import { getDbReader } from '@web-api/database';

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
