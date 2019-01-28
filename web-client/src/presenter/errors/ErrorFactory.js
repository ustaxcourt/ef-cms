import { UnauthorizedRequestError } from './UnauthorizedRequestError';
import { ActionError } from './ActionError';
import { InvalidRequestError } from './InvalidRequestError';
import { ServerInvalidResponseError } from './ServerInvalidResponseError';

export default {
  getError: e => {
    let responseCode = e.response && e.response.status;
    if ([401, 403, 404].indexOf(responseCode) !== -1) {
      return new UnauthorizedRequestError(e);
    } else if (/^[4]/.test(responseCode)) {
      return new InvalidRequestError(e);
    } else if (/^[5]/.test(responseCode)) {
      return new ServerInvalidResponseError(e);
    }
    return new ActionError(e);
  },
};
