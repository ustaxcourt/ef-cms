import { v4 as uuidv4 } from 'uuid';

export const getCognitoRequestPasswordResetUrl = () => {
  return process.env.COGNITO_PASSWORD_RESET_REQUEST_URL || '/';
};

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
