import { NotFoundError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';

export type PublicTrialSessionDetails = Pick<
  TrialSession,
  | 'swingSessionId'
  | 'trialLocation'
  | 'startDate'
  | 'courthouseName'
  | 'address1'
  | 'address2'
  | 'city'
  | 'state'
  | 'postalCode'
> & {
  calendaredCases: Omit<RawCase, 'consolidatedCases'>[];
  swingSessionLocation?: string;
};

export const getPublicTrialSessionDetailsInteractor = async (
  applicationContext: ServerApplicationContext,
  { trialSessionId }: { trialSessionId: string },
): Promise<PublicTrialSessionDetails> => {
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

  let swingSessionLocation: string | undefined;
  if (fullTrialSessionEntity.swingSessionId) {
    const swingSessionDetails = await applicationContext
      .getPersistenceGateway()
      .getTrialSessionById({
        applicationContext,
        trialSessionId: fullTrialSessionEntity.swingSessionId,
      });
    swingSessionLocation = swingSessionDetails?.trialLocation;
  }

  const cases = await applicationContext
    .getPersistenceGateway()
    .getCalendaredCasesForTrialSession({
      applicationContext,
      trialSessionId,
    });

  const casesWithMinimalRequiredInformation = cases
    .filter(aCase => !aCase.removedFromTrial)
    .map(aCase => {
      // No need to see docket entries
      const caseWithEmptyDocketEntries = {
        ...aCase,
        docketEntries: [],
      };
      return caseWithEmptyDocketEntries;
    });

  const publicTrialSessionData: PublicTrialSessionDetails = {
    address1: fullTrialSessionEntity.address1,
    address2: fullTrialSessionEntity.address2,
    calendaredCases: casesWithMinimalRequiredInformation,
    city: fullTrialSessionEntity.city,
    courthouseName: fullTrialSessionEntity.courthouseName,
    postalCode: fullTrialSessionEntity.postalCode,
    startDate: fullTrialSessionEntity.startDate,
    state: fullTrialSessionEntity.state,
    swingSessionId: fullTrialSessionEntity.swingSessionId,
    swingSessionLocation,
    trialLocation: fullTrialSessionEntity.trialLocation,
  };

  return publicTrialSessionData;
};
