import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { FORMATS } from '../../../../../shared/src/business/utilities/DateHandler';
import { Get } from 'cerebral';
import { TrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { state } from '@web-client/presenter/app.cerebral';

export const addTrialSessionInformationHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const { SESSION_TYPES, TRIAL_SESSION_PROCEEDING_TYPES } =
    applicationContext.getConstants();

  const { proceedingType, sessionScope } = get(state.form);

  const isStandaloneSession = TrialSession.isStandaloneRemote(sessionScope);

  const title = isStandaloneSession
    ? 'Remote Proceeding Information'
    : 'Location Information';

  const displayRemoteProceedingForm =
    proceedingType === TRIAL_SESSION_PROCEEDING_TYPES.remote ||
    isStandaloneSession;

  let sessionTypes = Object.values(SESSION_TYPES);

  if (isStandaloneSession) {
    sessionTypes = sessionTypes.filter(type => {
      return !['Special', 'Motion/Hearing'].includes(type);
    });
  }

  // NOTE: what happens if isStandaloneSession is true and user is docketclerk?
  const getSessionTypes = (user: AuthUser) => {
    return user.role === 'docketclerk'
      ? ['Special', 'Motion/Hearing']
      : sessionTypes;
  };
  const today = applicationContext.getUtilities().formatNow(FORMATS.YYYYMMDD);

  return {
    displayRemoteProceedingForm,
    getSessionTypes,
    isStandaloneSession,
    title,
    today,
  };
};
