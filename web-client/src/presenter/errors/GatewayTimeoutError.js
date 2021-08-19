import { ActionError } from './ActionError';

export class GatewayTimeoutError extends ActionError {
  // HTTP 504
  constructor() {
    const message = 'Try again.';
    super(message);
    this.title = 'The system is taking too long to respond';
    this.message = message;
  }
}
