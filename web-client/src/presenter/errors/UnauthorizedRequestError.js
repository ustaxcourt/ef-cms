import { CerebralError } from 'cerebral';
export class UnauthorizedRequestError extends CerebralError {
  // HTTP 403, 404
  constructor() {
    super(arguments);
    this.title = 'We cannot find the page you requested';
  }
}
