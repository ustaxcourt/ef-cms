import { NodeHttpHandler } from '@smithy/node-http-handler';
import { v4 as uuidv4 } from 'uuid';

export const getEnvironment = () => ({
  dynamoDbTableName: process.env.DYNAMODB_TABLE_NAME,
  stage: process.env.STAGE || 'local',
});

export const getPublicSiteUrl = () => {
  return process.env.PUBLIC_SITE_URL || 'http://localhost:5678';
};

export const getUniqueId = (): string => {
  return uuidv4();
};

export const ERROR_MAP_429 = {
  'advanced-query-limiter': {
    message: 'Please wait 1 minute before trying your search again',
    title: 'Search is experiencing high traffic',
  },
  'ip-limiter': {
    message: 'Please wait 1 minute before trying your search again.',
    title: "You've reached your search limit",
  },
  'user-id-limiter': {
    message: 'Please wait 1 minute before trying your search again',
    title: 'Search is experiencing high traffic',
  },
};

/**
 * Returns common configuration settings used across AWS v3 clients e.g. SQS, SES
 * @returns
 */
export const getAwsClientConfig = () => {
  return {
    maxAttempts: 3,
    region: 'us-east-1',
    requestHandler: new NodeHttpHandler({
      connectionTimeout: 3_000,
      requestTimeout: 5_000,
    }),
  };
};
