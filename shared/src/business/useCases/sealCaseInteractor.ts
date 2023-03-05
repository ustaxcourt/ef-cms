import { Case } from '../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../errors/errors';

/**
 * sealCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update
 * @returns {Promise<object>} the updated case data
 */
export const sealCaseInteractor = async (
  applicationContext: IApplicationContext,
  { docketNumber }: { docketNumber: string },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.SEAL_CASE)) {
    throw new UnauthorizedError('Unauthorized for sealing cases');
  }

  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  const oldCaseCopy = applicationContext
    .getUtilities()
    .cloneAndFreeze(caseRecord);
  const newCase = new Case(caseRecord, { applicationContext });

  newCase.setAsSealed();

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      newCase,
      oldCaseCopy,
    });

  await applicationContext
    .getDispatchers()
    .sendNotificationOfSealing(applicationContext, { docketNumber });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
