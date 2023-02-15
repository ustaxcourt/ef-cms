import { ActionError } from './ActionError';
export class UnauthorizedRequestError extends ActionError {
  // HTTP 403
  constructor(e) {
    const message = (e.response && e.response.data) || e.message;
    super(message);
    this.title = 'We cannot find the page you requested';
    this.message = message;
  }
}
