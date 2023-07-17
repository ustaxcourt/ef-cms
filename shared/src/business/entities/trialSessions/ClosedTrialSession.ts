import { SESSION_STATUS_TYPES } from '../EntityConstants';
import { TrialSession } from './TrialSession';

export class ClosedTrialSession extends TrialSession {
  constructor(rawSession: RawClosedTrialSession) {
    super(rawSession);

    this.sessionStatus = SESSION_STATUS_TYPES.closed;
  }
}

export type RawClosedTrialSession = ExcludeMethods<ClosedTrialSession>;
