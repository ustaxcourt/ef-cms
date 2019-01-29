import { CerebralError } from 'cerebral';
export class ActionError extends CerebralError {
  // an unclassified error
  get className() {
    return this.constructor.name;
  }
  constructor() {
    super(arguments);
    this.title = 'An error occurred';
    this.message = 'generic error message';
  }
}
