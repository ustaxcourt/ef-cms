import { FORMATS } from '../../../../../shared/src/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const addTrialSessionInformationHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
) => {
  const { SESSION_TYPES, TRIAL_SESSION_PROCEEDING_TYPES } =
    applicationContext.getConstants();

  const { proceedingType, sessionScope } = get(state.form);

  // FEATURE FLAG: standalone_remote_session
  const FEATURE_canDisplayStandaloneRemote =
    applicationContext.isFeatureEnabled('standalone_remote_session');

  const isStandaloneSession = applicationContext
    .getUtilities()
    .isStandaloneRemoteSession(sessionScope);

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

  const today = applicationContext.getUtilities().formatNow(FORMATS.YYYYMMDD);

  return {
    FEATURE_canDisplayStandaloneRemote,
    displayRemoteProceedingForm,
    isStandaloneSession,
    sessionTypes,
    title,
    today,
  };
};
