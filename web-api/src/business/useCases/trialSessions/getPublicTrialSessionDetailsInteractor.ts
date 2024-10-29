import { NotFoundError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TRIAL_SESSION_SCOPE_TYPES } from '@shared/business/entities/EntityConstants';
import { TrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';

type PublicTrialSessionDetails = {
  openCases: any[];
  isSwingSession: boolean;
  swingSessionId?: string;
  swingSessionLocation: string;
  isRemote: boolean;
};

export const getPublicTrialSessionDetailsInteractor = async (
  applicationContext: ServerApplicationContext,
  { trialSessionId }: { trialSessionId: string },
): Promise<PublicTrialSessionDetails> => {
  console.log('getPublicTrialSessionDetailsInteractor', trialSessionId);
  const trialSessionDetails = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  if (!trialSessionDetails) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  const fullTrialSessionEntity = new TrialSession(
    trialSessionDetails,
  ).validate();

  const allCases = await applicationContext
    .getPersistenceGateway()
    .getCasesByDocketNumbers({
      applicationContext,
      docketNumbers: fullTrialSessionEntity.caseOrder.map(c => c.docketNumber),
    });

  console.log('LOOK HERE!');
  console.log(allCases);

  const publicTrialSessionData: PublicTrialSessionDetails = {
    // TODO, see getTrialSessionDetailsAction, but why is this not in the API itself?
    isRemote:
      fullTrialSessionEntity.sessionScope ===
      TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,

    isSwingSession: !!fullTrialSessionEntity.swingSession,

    openCases: allCases.filter(c => !c.removedFromTrial),
    swingSessionId: fullTrialSessionEntity.swingSessionId,
    swingSessionLocation: '',
  };

  return publicTrialSessionData;
};
