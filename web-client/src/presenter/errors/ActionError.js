import { CerebralError } from 'cerebral';
export class ActionError extends CerebralError {
  // an unclassified error
  get className() {
    return this.constructor.name;
  }
  constructor(message) {
    super(arguments);
    this.title = 'An error occurred';
    this.message = message || 'An unspecified error occurred.';
  }
}
