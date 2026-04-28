import { BlockedCaseData } from '@web-api/persistence/postgres/cases/reports/getBlockedCasesForTrialLocation';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getBlockedCasesInteractor = (
  applicationContext: ClientApplicationContext,
  { trialLocation, blockedCaseFilter },
): Promise<BlockedCaseData[]> => {
  return get({
    applicationContext,
    endpoint: `/reports/blocked/${trialLocation}`,
    params: { blockedCaseFilter },
  });
};
