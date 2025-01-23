import { ActionError } from './ActionError';
export class UnidentifiedUserError extends ActionError {
  // HTTP 401
  constructor() {
    // eslint-disable-next-line prefer-rest-params
    super(arguments);
    this.title = 'You are not logged in';
    this.message = 'Please log into your account to continue';
  }
}
