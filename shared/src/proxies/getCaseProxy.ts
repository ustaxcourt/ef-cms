import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';
import { get } from './requests';
import { PublicCaseDTO } from '@shared/business/dto/cases/PublicCaseDTO';
import { RestrictedCaseDTO } from '@shared/business/dto/cases/RestrictedCaseDTO';

/**
 * getCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the id of the case to retrieve
 * @returns {Promise<*>} the promise of the api call
 */
export const getCaseInteractor = (
  applicationContext,
  { docketNumber },
): Promise<CaseDTO | RestrictedCaseDTO | PublicCaseDTO> => {
  return get({
    applicationContext,
    endpoint: `/cases/${docketNumber}`,
    params: { excludeDocketEntries: true },
  });
};
