import { UnauthorizedRequestError } from './UnauthorizedRequestError';
import { ActionError } from './ActionError';
import { InvalidRequestError } from './InvalidRequestError';
import { ServerInvalidResponseError } from './ServerInvalidResponseError';
import { UnidentifiedUserError } from './UnidentifiedUserError';

export default {
  getError: e => {
    let responseCode = (e.response && e.response.status) || e.statusCode;
    if ([403, 404].includes(responseCode)) {
      return new UnauthorizedRequestError(e);
    } else if (401 === responseCode) {
      return new UnidentifiedUserError();
    } else if (/^4/.test(responseCode)) {
      return new InvalidRequestError(e);
    } else if (/^5/.test(responseCode)) {
      return new ServerInvalidResponseError(e);
    }
    return new ActionError(e);
  },
};
