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

export const ERROR_429 = {
  message: 'Please wait 1 minute before trying your search again',
  title: 'Search is experiencing high traffic',
};
