import { CerebralError } from 'cerebral';
export class ActionError extends CerebralError {
  // all other unclassified errors
  constructor() {
    super(arguments);
    this.title = 'An error occurred';
    this.message = 'generic error message';
  }
}
