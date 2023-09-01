import {
  CaseWorksheet,
  RawCaseWorksheet,
} from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';

export const updateCaseWorksheetInteractor = async (
  applicationContext: IApplicationContext,
  { updatedCaseWorksheet }: { updatedCaseWorksheet: RawCaseWorksheet },
): Promise<void> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_WORKSHEET)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseWorksheet = new CaseWorksheet(updatedCaseWorksheet, {
    applicationContext,
  }).validate();

  await applicationContext.getPersistenceGateway().updateCaseWorksheet({
    applicationContext,
    caseWorksheet: caseWorksheet.toRawObject(),
    judgeUserId: user.userId,
  });
};
