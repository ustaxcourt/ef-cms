import { ActionError } from './ActionError';

export class GatewayTimeoutError extends ActionError {
  // HTTP 504
  constructor(e) {
    const message = (e.response && e.response.data) || e.message;
    super(message);
    this.title = 'The response from the server took too long'; // TODO messaging here
    this.message = message;
  }
}
