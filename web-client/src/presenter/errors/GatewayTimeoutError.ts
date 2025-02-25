import { ActionError } from './ActionError';
export const GatewayTimeoutErrorTitle =
  'The system is taking too long to respond';

export class GatewayTimeoutError extends ActionError {
  // HTTP 504
  constructor() {
    const message = 'Try again.';
    super(message);
    this.title = GatewayTimeoutErrorTitle;
    this.message = message;
  }
}
