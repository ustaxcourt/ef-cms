import { NotFoundError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TRIAL_SESSION_SCOPE_TYPES } from '@shared/business/entities/EntityConstants';
import { TrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';

type PublicTrialSessionDetails = {
  openCases: any[];
  isRemote: boolean;
  isSwingSession: boolean;
  swingSessionId?: string;
  swingSessionLocation?: string; // The location of the related swing session, if there is one
  trialLocation?: string; // The location of this particular session
  startDate: string;
  estimatedEndDate?: string;
  term: string;
  sessionStatus: string;
};

export const getPublicTrialSessionDetailsInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    addSwingSessionDetails = true,
    trialSessionId,
  }: { trialSessionId: string; addSwingSessionDetails: boolean },
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

  const publicTrialSessionData: PublicTrialSessionDetails = {
    estimatedEndDate: fullTrialSessionEntity.estimatedEndDate,
    isRemote:
      fullTrialSessionEntity.sessionScope ===
      TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
    isSwingSession: !!fullTrialSessionEntity.swingSession,
    openCases: allCases.filter(c => !c.removedFromTrial),
    sessionStatus: fullTrialSessionEntity.sessionStatus,
    startDate: fullTrialSessionEntity.startDate,
    swingSessionId: fullTrialSessionEntity.swingSessionId,
    swingSessionLocation: '',
    term: fullTrialSessionEntity.term,
    trialLocation: fullTrialSessionEntity.trialLocation,
  };

  // Get the details associated with this session's related swing session, if applicable
  if (
    fullTrialSessionEntity.swingSession &&
    fullTrialSessionEntity.swingSessionId &&
    addSwingSessionDetails
  ) {
    const relatedSwingSession = await getPublicTrialSessionDetailsInteractor(
      applicationContext,
      {
        addSwingSessionDetails: false, // Avoid infinite recursion
        trialSessionId: fullTrialSessionEntity.swingSessionId,
      },
    );
    // Set swing session details here
    publicTrialSessionData.swingSessionLocation =
      relatedSwingSession.trialLocation;
  }

  return publicTrialSessionData;
};
