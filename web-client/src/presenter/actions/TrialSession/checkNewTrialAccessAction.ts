import { state } from '@web-client/presenter/app.cerebral';
import {
  ROLES,
  SESSION_STATUS_TYPES,
} from '@shared/business/entities/EntityConstants';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';

/**
 * Used to determine if the judge is attempting to access a new trial
 * They should not be able to. If they attempt to access it, then let's return
 * path no
 */
export const checkNewTrialAccessAction = ({
  get,
  path,
  props,
}: ActionProps) => {
  const user = get(state.user);

  const { trialSession }: { trialSession: RawTrialSession } = props;

  if (
    trialSession.sessionStatus === SESSION_STATUS_TYPES.new &&
    (user.role === ROLES.judge || user.role === ROLES.chambers)
  ) {
    return path.noAccess();
  } else {
    return path.yesAccess();
  }
};
