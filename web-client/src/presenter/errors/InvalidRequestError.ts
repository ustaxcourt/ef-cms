import { ActionError } from './ActionError';
export class InvalidRequestError extends ActionError {
  // HTTP 4xx unknown error
  constructor(e) {
    const message =
      (e.response && e.response.data) ||
      'Ensure that you are using a supported browser: Chrome, Firefox, Safari, MS Edge, or IE11 (or later)';
    super(message);
    this.title = 'An unexpected error has occurred';
    this.message = message;
  }
}
