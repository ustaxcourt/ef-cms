import { ActionError } from './ActionError';
export class UnidentifiedUserError extends ActionError {
  // HTTP 401
  constructor() {
    super(arguments);
    this.title = 'You are not logged in';
    this.message = 'Please log into your account to continue';
  }
}
