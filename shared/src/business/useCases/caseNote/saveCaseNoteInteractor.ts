import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '../../../authorization/authorizationClientService';
import { Case } from '../../entities/cases/Case';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * saveCaseNoteInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update case note
 * @param {string} providers.caseNote the note to update
 * @returns {object} the updated case note returned from persistence
 */
export const saveCaseNoteInteractor = async (
  applicationContext: IApplicationContext,
  { caseNote, docketNumber }: { caseNote: string; docketNumber: string },
) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_NOTES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseToUpdate = new Case(
    { ...caseRecord, caseNote },
    {
      applicationContext,
    },
  )
    .validate()
    .toRawObject();

  const result = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate,
    });

  return new Case(result, { applicationContext }).validate().toRawObject();
};
