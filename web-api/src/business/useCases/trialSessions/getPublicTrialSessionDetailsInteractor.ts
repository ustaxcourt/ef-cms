import { NotFoundError } from '@web-api/errors/errors';
import { PublicCase } from '@shared/business/entities/cases/PublicCase';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TRIAL_SESSION_SCOPE_TYPES } from '@shared/business/entities/EntityConstants';
import { TrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';

export type PublicTrialSessionDetails = Pick<
  TrialSession,
  | 'swingSessionId'
  | 'trialLocation'
  | 'startDate'
  | 'estimatedEndDate'
  | 'term'
  | 'sessionStatus'
  | 'termYear'
  | 'sessionType'
  | 'courthouseName'
  | 'address1'
  | 'address2'
  | 'city'
  | 'state'
  | 'postalCode'
> & {
  calendaredCases: RawPublicCase[];
  isRemote: boolean;
  isSwingSession: boolean;
  swingSessionLocation?: string;
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

  const cases = await applicationContext
    .getPersistenceGateway()
    .getCalendaredCasesForTrialSession({
      applicationContext,
      trialSessionId,
    });

  const casesWithMinimalRequiredInformation = cases.map(aCase => {
    return new PublicCase(aCase, { authorizedUser: undefined }).toRawObject();
  });

  const publicTrialSessionData: PublicTrialSessionDetails = {
    address1: fullTrialSessionEntity.address1,
    address2: fullTrialSessionEntity.address2,
    calendaredCases: casesWithMinimalRequiredInformation,
    city: fullTrialSessionEntity.city,
    courthouseName: fullTrialSessionEntity.courthouseName,
    estimatedEndDate: fullTrialSessionEntity.estimatedEndDate,
    isRemote:
      fullTrialSessionEntity.sessionScope ===
      TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
    isSwingSession: !!fullTrialSessionEntity.swingSession,
    postalCode: fullTrialSessionEntity.postalCode,
    sessionStatus: fullTrialSessionEntity.sessionStatus,
    sessionType: fullTrialSessionEntity.sessionType,
    startDate: fullTrialSessionEntity.startDate,
    state: fullTrialSessionEntity.state,
    swingSessionId: fullTrialSessionEntity.swingSessionId,
    swingSessionLocation: '',
    term: fullTrialSessionEntity.term,
    termYear: fullTrialSessionEntity.termYear,
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
