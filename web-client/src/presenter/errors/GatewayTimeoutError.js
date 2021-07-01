import { ActionError } from './ActionError';

export class GatewayTimeoutError extends ActionError {
  // HTTP 504
  constructor() {
    const message = 'The server took too long to process a response.';
    super(message);
    this.title = 'Gateway Timeout'; // TODO messaging here
    this.message = message;
  }
}
