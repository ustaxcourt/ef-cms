import { CerebralError } from 'cerebral';
export class ActionError extends CerebralError {
  public title: string;
  public message: string;
  public originalError?: Object;
  public responseCode?: string;
  // an unclassified error
  get className() {
    return this.constructor.name;
  }
  constructor(message) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments);
    this.title = 'An error occurred';
    this.message = message || 'An unspecified error occurred.';
  }
}
