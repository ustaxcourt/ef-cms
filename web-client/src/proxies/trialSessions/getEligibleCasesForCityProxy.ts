import { get } from '../requests';
import { RawEligibleCase } from '@shared/business/entities/cases/EligibleCase';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getEligibleCasesForCityInteractor = (
  applicationContext: ClientApplicationContext,
  { trialCity },
): Promise<RawEligibleCase[]> => {
  return get({
    applicationContext,
    endpoint: `/cases/${trialCity}/eligible-cases`,
  });
};
