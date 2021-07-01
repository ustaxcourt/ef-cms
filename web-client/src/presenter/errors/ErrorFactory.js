import { ActionError } from './ActionError';
import { GatewayTimeoutError } from './GatewayTimeoutError';
import { InvalidRequestError } from './InvalidRequestError';
import { NotFoundError } from './NotFoundError';
import { ServerInvalidResponseError } from './ServerInvalidResponseError';
import { UnauthorizedRequestError } from './UnauthorizedRequestError';
import { UnidentifiedUserError } from './UnidentifiedUserError';

export const ErrorFactory = {
  getError: e => {
    let responseCode =
      (e.response && e.response.status) || e.status || e.statusCode;

    let newError = new ActionError(e);
    if (403 == responseCode) {
      newError = new UnauthorizedRequestError(e);
    } else if (404 == responseCode) {
      newError = new NotFoundError(e);
    } else if (401 == responseCode) {
      newError = new UnidentifiedUserError();
    } else if (504 === responseCode) {
      newError = new GatewayTimeoutError(e);
    } else if (/^4/.test(responseCode)) {
      newError = new InvalidRequestError(e);
    } else if (/^5/.test(responseCode)) {
      newError = new ServerInvalidResponseError(e);
    } else if (!e.response) {
      // this should only happen if cognito throws a cors exception due to expired tokens or invalid tokens
      newError = new UnidentifiedUserError(e);
    }
    newError.originalError = e;
    newError.responseCode = responseCode;
    return newError;
  },
};
