import { ActionError } from './ActionError';
export class ReadOnlyModeError extends ActionError {
  constructor() {
    const message =
      'System is upgrading. Please wait a few minutes and try again.';
    super(message);
    this.title = 'System Upgrade in Progress';
    this.message = message;
  }
}
