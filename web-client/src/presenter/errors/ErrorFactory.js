import { UnauthorizedRequestError } from './UnauthorizedRequestError';
import { ActionError } from './ActionError';
import { InvalidRequestError } from './InvalidRequestError';
import { ServerInvalidResponseError } from './ServerInvalidResponseError';
import { UnidentifiedUserError } from './UnidentifiedUserError';

export default e => {
  let responseCode = e.response && e.response.statusCode;
  if (responseCode == '401') {
    return new UnidentifiedUserError(e);
  } else if ([403, 404].indexOf(responseCode) !== -1) {
    return new UnauthorizedRequestError(e);
  } else if (/^[4]/.test(responseCode)) {
    return new InvalidRequestError(e);
  } else if (/^[5]/.test(responseCode)) {
    return new ServerInvalidResponseError(e);
  }
  return new ActionError(e);
};
