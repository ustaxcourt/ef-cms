import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getEligibleCasesForTrialCity } from '@web-api/persistence/postgres/cases/getEligibleCasesForTrialCity';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import {
  EligibleCase,
  RawEligibleCase,
} from '@shared/business/entities/cases/EligibleCase';
import { CASE_STATUS_TYPES } from '../entities/EntityConstants';
import { dateStringsCompared, createISODateString, calculateISODate } from '../utilities/DateHandler';

export const getEligibleCasesForCityInteractor = async (
  { trialCity }: { trialCity: string },
  authorizedUser: UnknownAuthUser,
): Promise<RawEligibleCase[] | undefined> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError(
      `Invalid User attempting to view eligible cases for: ${trialCity}`,
    );
  }

  const eligibleCases = await getEligibleCasesForTrialCity({
    trialCity,
  });

  // TODO: make a function for this
  const eligibleCasesWithIsAgedCase = eligibleCases.map(eligibleCase => {
    console.log('c: ', { ...eligibleCase, docketEntries: undefined });
    let isAgedCase: boolean;
    if (
      [
        CASE_STATUS_TYPES.closed,
        CASE_STATUS_TYPES.closedDismissed,
        CASE_STATUS_TYPES.onAppeal,
      ].some(status => eligibleCase.status === status)
    ) {
      isAgedCase = false;
    } else {
      const filingDate =
        eligibleCase.docketEntries
          .map(docketEntry => docketEntry.filingDate)
          .sort((a, b) => dateStringsCompared(b, a))[0] ||
        createISODateString();
      isAgedCase =
        dateStringsCompared(
          filingDate,
          calculateISODate({
            dateString: createISODateString(),
            howMuch: -365,
          }),
        ) < 0;
    }
    return {
      ...eligibleCase,
      isAgedCase,
    };
  });

  return eligibleCasesWithIsAgedCase.map(rawCase => {
    return new EligibleCase(rawCase).validate().toRawObject();
  });
};
