import { ActionError } from './ActionError';
import { InvalidRequestError } from './InvalidRequestError';
import { NotFoundError } from './NotFoundError';
import { ServerInvalidResponseError } from './ServerInvalidResponseError';
import { UnauthorizedRequestError } from './UnauthorizedRequestError';
import { UnidentifiedUserError } from './UnidentifiedUserError';

export const ErrorFactory = {
  getError: e => {
    let responseCode = (e.response && e.response.status) || e.statusCode;

    let newError = new ActionError({ ...e, responseCode });
    if (403 == responseCode) {
      newError = new UnauthorizedRequestError({ ...e, responseCode });
    } else if (404 == responseCode) {
      newError = new NotFoundError({ ...e, responseCode });
    } else if (401 == responseCode) {
      newError = new UnidentifiedUserError({ ...e, responseCode });
    } else if (/^4/.test(responseCode)) {
      newError = new InvalidRequestError({ ...e, responseCode });
    } else if (/^5/.test(responseCode)) {
      newError = new ServerInvalidResponseError({ ...e, responseCode });
    } else if (!e.response) {
      // this should only happen if cognito throws a cors exception due to expired tokens or invalid tokens
      newError = new UnidentifiedUserError({ ...e, responseCode });
    }
    newError.originalError = e;
    return newError;
  },
};
