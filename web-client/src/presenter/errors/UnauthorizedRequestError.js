import { CerebralError } from 'cerebral';
export class UnauthorizedRequestError extends CerebralError {
  // HTTP 403, 404
  constructor() {
    super(arguments);
    this.title = "We can't find the page you requested";
  }
}
