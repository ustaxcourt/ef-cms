import { ActionError } from './ActionError';
export class NotFoundError extends ActionError {
  // HTTP 404
  constructor(e) {
    const message = (e.response && e.response.data) || e.message;
    super(message);
    this.title = 'We cannot find the page you requested';
    this.message = message;
  }
}
