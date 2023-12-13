import { createAuthorizer } from './createAuthorizer';

const getToken = event => {
  return event.queryStringParameters && event.queryStringParameters.token;
};

export const handler = createAuthorizer(getToken);
