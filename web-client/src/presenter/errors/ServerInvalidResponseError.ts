import { ActionError } from './ActionError';
export class ServerInvalidResponseError extends ActionError {
  // HTTP 5XX series errors
  constructor() {
    // eslint-disable-next-line prefer-rest-params
    super(arguments);
    this.title = 'An error has occurred';
    this.message = 'Please try your action again';
  }
}
