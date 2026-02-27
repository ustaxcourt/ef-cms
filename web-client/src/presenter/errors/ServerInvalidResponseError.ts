import { ActionError } from './ActionError';
export class ServerInvalidResponseError extends ActionError {
  // HTTP 5XX series errors
  constructor() {
    const message = 'Please try your action again';
    super(message);
    this.title = 'An error has occurred';
    this.message = message;
  }
}
