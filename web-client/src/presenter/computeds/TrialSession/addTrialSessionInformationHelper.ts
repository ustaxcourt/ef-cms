import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { FORMATS } from '../../../../../shared/src/business/utilities/DateHandler';
import { Get } from 'cerebral';
import { SESSION_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { TrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { state } from '@web-client/presenter/app.cerebral';
import { trialSessionOptionText } from '@web-client/presenter/computeds/addToTrialSessionModalHelper';

export const addTrialSessionInformationHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  displayRemoteProceedingForm: boolean;
  isStandaloneSession: boolean;
  sessionTypes: string[];
  title: string;
  today: string;
  swingSessions: { trialSessionId: string; swingSessionText: string }[];
  showSwingSessionList: boolean;
  showSwingSessionOption: boolean;
} => {
  const { SESSION_TYPES, TRIAL_SESSION_PROCEEDING_TYPES } =
    applicationContext.getConstants();
  const { proceedingType, sessionScope } = get(state.form);
  const trialSessions: TrialSessionInfoDTO[] = get(state.trialSessions) || [];
  const selectedTerm = get(state.form.term);
  const selectedTermYear = get(state.form.termYear);
  const currentTrialSessionId = get(state.trialSession.trialSessionId);

  const isStandaloneSession = TrialSession.isStandaloneRemote(sessionScope);

  const title = isStandaloneSession
    ? 'Remote Proceeding Information'
    : 'Location Information';

  const displayRemoteProceedingForm =
    proceedingType === TRIAL_SESSION_PROCEEDING_TYPES.remote ||
    isStandaloneSession;

  const DISALLOWED_STANDALONE_SESSION_TYPES = ['Special', 'Motion/Hearing'];
  const DOCKETCLERK_EDITABLE_SESSION_TYPES = ['Special', 'Motion/Hearing'];

  let sessionTypes = Object.values(SESSION_TYPES);

  if (isStandaloneSession) {
    sessionTypes = sessionTypes.filter(type => {
      return !DISALLOWED_STANDALONE_SESSION_TYPES.includes(type);
    });
  }

  // NOTE: what happens if isStandaloneSession is true and user is docketclerk?
  const getSessionTypes = (user: AuthUser) => {
    return user.role === 'docketclerk'
      ? DOCKETCLERK_EDITABLE_SESSION_TYPES
      : sessionTypes;
  };
  const today = applicationContext.getUtilities().formatNow(FORMATS.YYYYMMDD);

  const validSwingSessions: {
    trialSessionId: string;
    swingSessionText: string;
  }[] = trialSessions
    .filter(trialSession => trialSession.termYear === selectedTermYear)
    .filter(trialSession => trialSession.term === selectedTerm)
    .filter(
      trialSession =>
        trialSession.sessionStatus !== SESSION_STATUS_TYPES.closed,
    )
    .filter(
      trialSession => trialSession.trialSessionId !== currentTrialSessionId,
    )
    .sort((sessionA, sessionB) => {
      const aTrialLocation = sessionA.trialLocation || '';
      const bTrialLocation = sessionB.trialLocation || '';
      if (aTrialLocation === bTrialLocation) {
        return sessionA.startDate.localeCompare(sessionB.startDate);
      }
      return aTrialLocation.localeCompare(bTrialLocation);
    })
    .map(trialSession => {
      const swingSessionText = trialSessionOptionText(trialSession);
      return {
        swingSessionText,
        trialSessionId: trialSession.trialSessionId || '',
      };
    });

  return {
    displayRemoteProceedingForm,
    isStandaloneSession,
    sessionTypes: getSessionTypes(get(state.user)),
    showSwingSessionList: get(state.form.swingSession),
    showSwingSessionOption: validSwingSessions.length > 0,
    swingSessions: validSwingSessions,
    title,
    today,
  };
};
