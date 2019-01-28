import { CerebralError } from 'cerebral';
export class InvalidRequestError extends CerebralError {
  // HTTP 4xx unknown error
  constructor() {
    super(arguments);
    this.title = 'An unexpected error has occurred';
    this.message =
      'Ensure that you are using a supported browser: Chrome, Firefox, Safari, MS Edge, or IE11 (or later)';
  }
}
