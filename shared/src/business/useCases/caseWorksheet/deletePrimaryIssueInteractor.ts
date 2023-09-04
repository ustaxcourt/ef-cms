import {
  CaseWorksheet,
  RawCaseWorksheet,
} from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';

export const deletePrimaryIssueInteractor = async (
  applicationContext: IApplicationContext,
  { docketNumber }: { docketNumber: string },
): Promise<RawCaseWorksheet> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_WORKSHEET)) {
    throw new UnauthorizedError('Unauthorized');
  }

  if (!docketNumber) {
    throw new InvalidRequest('Docket number is required.');
  }

  const rawWorksheet = await applicationContext
    .getPersistenceGateway()
    .getCaseWorksheet({ applicationContext, docketNumber });

  const caseWorksheetEntity = new CaseWorksheet(rawWorksheet);

  caseWorksheetEntity.deletePrimaryIssue();

  caseWorksheetEntity.validate();

  const rawCaseWorksheet = caseWorksheetEntity.toRawObject();

  await applicationContext.getPersistenceGateway().updateCaseWorksheet({
    applicationContext,
    caseWorksheet: rawCaseWorksheet,
    judgeUserId: user.userId,
  });

  return rawCaseWorksheet;
};
