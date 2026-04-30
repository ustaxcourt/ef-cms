#!/usr/bin/env -S npx ts-node --transpile-only

import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { S3Client } from '@aws-sdk/client-s3';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { environment } from '@web-api/environment';
import { truncateAllCognitoUsers } from './truncate-cognito.helpers';
import { truncateAllOpenSearchIndices } from './truncate-opensearch.helpers';
import { truncateAllPostgresTables } from './truncate-postgres.helpers';
import { truncateS3DocumentsBucket } from './truncate-s3-documents.helpers';

const scriptConfig: ScriptConfig = {
  description:
    'truncate-all-persistence - Truncates all DAWSON persistence: postgres ' +
    'tables (except dw_feature_flag and kysely_migration*), ' +
    'opensearch indices, cognito users, and the documents S3 bucket.',
  environment: {
    UserPoolId: 'USER_POOL_ID',
    elasticsearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
    environmentName: 'ENV',
    region: 'REGION',
  },
  preventExecutionAgainst: ['prod', 'test', 'irs'],
  requireActiveAwsSession: true,
};

const { UserPoolId, elasticsearchEndpoint, environmentName, region } =
  parseArgsAndEnvVars(scriptConfig) as {
    [k: string]: string;
  };

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  console.log('Truncating Postgres tables...');
  await truncateAllPostgresTables();

  console.log('Truncating OpenSearch indices...');
  await truncateAllOpenSearchIndices({
    elasticsearchEndpoint,
    environmentName,
  });

  console.log('Truncating Cognito users...');
  const cognito = new CognitoIdentityProvider({ region });
  await truncateAllCognitoUsers({ cognito, UserPoolId });

  console.log('Truncating S3 documents bucket...');
  const s3Client = new S3Client({ region });
  await truncateS3DocumentsBucket({
    bucketName: environment.documentsBucketName,
    s3Client,
  });

  console.log('All persistence truncated.');
})();
