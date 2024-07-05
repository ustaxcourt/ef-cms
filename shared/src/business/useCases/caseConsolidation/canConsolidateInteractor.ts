import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '../../entities/cases/Case';

/**
 * canConsolidateInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.caseToConsolidate the case to consolidate with
 * @param {object} providers.currentCase the case to check if caseToConsolidate can be consolidated with
 * @returns {object} whether or not the cases can be consolidated with the reason
 */
export const canConsolidateInteractor = (
  authorizedUser: AuthUser,
  {
    caseToConsolidate,
    currentCase,
  }: { caseToConsolidate: Case; currentCase: Case },
) => {
  const caseEntity = new Case(currentCase, {
    authorizedUser,
  });

  const results = caseEntity.getConsolidationStatus({
    caseEntity: caseToConsolidate,
  });

  return results;
};
