import { CerebralError } from 'cerebral';
export class UnidentifiedUserError extends CerebralError {
  // HTTP 401
  constructor() {
    super(arguments);
    this.title = 'You are not logged in';
    this.message = 'Please log into your account to continue';
  }
}
