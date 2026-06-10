import { NotFoundError } from '@web-api/errors/errors';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { getCalendaredCasesForTrialSession } from '@web-api/persistence/postgres/trialSessions/getCalendaredCasesForTrialSession';
import { CaseFactory } from '@web-api/business/entities/cases/CaseFactory';
import { PublicCaseDTO } from '@shared/business/dto/cases/PublicCaseDTO';
import { RestrictedCaseDTO } from '@shared/business/dto/cases/RestrictedCaseDTO';

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
  calendaredCases: (PublicCaseDTO | RestrictedCaseDTO)[];
  swingSessionLocation?: string;
};

export const getPublicTrialSessionDetailsInteractor = async ({
  trialSessionId,
}: {
  trialSessionId: string;
}): Promise<PublicTrialSessionDetails> => {
  const trialSessionDetails = await getTrialSessionById({
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
    const swingSessionDetails = await getTrialSessionById({
      trialSessionId: fullTrialSessionEntity.swingSessionId,
    });
    swingSessionLocation = swingSessionDetails?.trialLocation;
  }

  const cases = await getCalendaredCasesForTrialSession({
    trialSessionId,
  });

  const casesWithMinimalRequiredInformation = cases
    .filter(aCase => !aCase.removedFromTrial)
    .map(aCase => {
      // No need to see docket entries

      return CaseFactory.getCaseDTO({
        rawCase: { ...aCase, docketEntries: [] },
        user: undefined,
      }) as PublicCaseDTO | RestrictedCaseDTO;
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
