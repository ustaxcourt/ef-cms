import { Case } from '../../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';
/**
 * updateUserCaseNoteInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update notes
 * @param {string} providers.notes the notes to update
 * @returns {object} the updated case note returned from persistence
 */
export const updateCaseWorksheetInfoInteractor = async (
  applicationContext,
  {
    docketNumber,
    finalBriefDueDate,
    statusOfMatter,
  }: {
    docketNumber: string;
    statusOfMatter?: string;
    finalBriefDueDate?: string;
  },
) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, ROLE_PERMISSIONS.UPDATE_CASE_PRIMARY_ISSUE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  if (finalBriefDueDate !== undefined) {
    caseRecord.finalBriefDueDate = finalBriefDueDate;
  }

  if (statusOfMatter !== undefined) {
    caseRecord.statusOfMatter = statusOfMatter;
  }

  const updatedCaseRecord = new Case(caseRecord, {
    applicationContext,
  });

  const validRawCaseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: updatedCaseRecord,
    });

  return validRawCaseEntity;
};
