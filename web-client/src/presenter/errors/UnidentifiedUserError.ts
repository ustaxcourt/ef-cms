import { ActionError } from './ActionError';
export class UnidentifiedUserError extends ActionError {
  // HTTP 401
  constructor() {
    const message = 'Please log into your account to continue';
    super(message);
    this.title = 'You are not logged in';
    this.message = message;
  }
}
