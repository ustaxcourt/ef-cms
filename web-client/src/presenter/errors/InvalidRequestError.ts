import { ActionError } from './ActionError';
export class InvalidRequestError extends ActionError {
  // HTTP 4xx unknown error
  constructor() {
    super(arguments);
    this.title = 'An unexpected error has occurred';
    this.message =
      'Ensure that you are using a supported browser: Chrome, Firefox, Safari, MS Edge, or IE11 (or later)';
  }
}
