import { CerebralError } from 'cerebral';
export class ServerInvalidResponseError extends CerebralError {
  // HTTP 5XX series errors
  constructor() {
    super(arguments);
    this.title = 'An error has occurred';
    this.message = 'Please try your action again';
  }
}
