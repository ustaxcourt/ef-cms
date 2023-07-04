import { ClosedTrialSession } from './ClosedTrialSession';
import { NewTrialSession } from './NewTrialSession';
import { OpenTrialSession } from './OpenTrialSession';
import { SESSION_STATUS_TYPES } from '../EntityConstants';
import { TrialSession } from './TrialSession';

export function TrialSessionFactory(
  rawProps,
  applicationContext: IApplicationContext,
): TrialSession {
  switch (rawProps.sessionStatus) {
    case SESSION_STATUS_TYPES.closed:
      return new ClosedTrialSession(rawProps);
    case SESSION_STATUS_TYPES.open:
      return new OpenTrialSession(rawProps);
    case SESSION_STATUS_TYPES.new:
      return new NewTrialSession(rawProps, { applicationContext });
    default:
      throw new Error(
        `Cannot create a trial session with unknown status: ${rawProps.sessionStatus}`,
      );
  }
}
