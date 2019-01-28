import { CerebralError } from 'cerebral';
export class UnauthorizedRequestError extends CerebralError {
  // HTTP 403, 404
  constructor(e) {
    const message =
      (e && e.response && e.response.data) || e.message || 'unknown';
    super(message);
    this.title = 'We cannot find the page you requested';
    this.message = message;
  }
}
