import { createAuthorizer } from './createAuthorizer';

const getToken = event => {
  return event.authorizationToken.substring(7);
};

export const handler = createAuthorizer(getToken);
