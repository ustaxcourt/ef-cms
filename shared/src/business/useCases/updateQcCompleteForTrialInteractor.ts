import { Case } from '../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../errors/errors';

/**
 * updateQcCompleteForTrialInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {boolean} providers.qcCompleteForTrial true if case is qc complete for trial, false otherwise
 * @param {string} providers.trialSessionId the id of the trial session to update
 * @returns {Promise<object>} the updated case data
 */

export const updateQcCompleteForTrialInteractor = async (
  applicationContext: IApplicationContext,
  {
    docketNumber,
    qcCompleteForTrial,
    trialSessionId,
  }: {
    docketNumber: string;
    qcCompleteForTrial: boolean;
    trialSessionId: string;
  },
): Promise<TCase> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSION_QC_COMPLETE)) {
    throw new UnauthorizedError('Unauthorized for trial session QC complete');
  }

  const oldCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  const newCase = new Case(oldCase, { applicationContext });

  newCase.setQcCompleteForTrial({ qcCompleteForTrial, trialSessionId });

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: newCase,
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
