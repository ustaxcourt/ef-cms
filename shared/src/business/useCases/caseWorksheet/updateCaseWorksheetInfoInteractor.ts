import { Case } from '../../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';

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

	//fetch new entitie
		//not the case (too complex)
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  // TODO: will this allow us to remove the date?
  if (finalBriefDueDate !== undefined) {
    caseRecord.finalBriefDueDate = finalBriefDueDate;
  }

  if (statusOfMatter !== undefined) {
    caseRecord.statusOfMatter = statusOfMatter;
  }

	//create new entity instead of case
  const updatedCaseRecord = new Case(caseRecord, {
    applicationContext,
  });

	//create new helper to persist new entity to the database
  const validRawCaseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: updatedCaseRecord,
    });

  return validRawCaseEntity;
};
