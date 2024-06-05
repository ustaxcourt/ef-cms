import {
  CaseWorksheet,
  RawCaseWorksheet,
} from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';

export const updateCaseWorksheetInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    worksheet,
  }: {
    worksheet: RawCaseWorksheet;
  },
): Promise<RawCaseWorksheet> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_WORKSHEET)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const judgeUser = await applicationContext
    .getUseCaseHelpers()
    .getJudgeForUserHelper(applicationContext, { user });

  const caseWorksheetEntity = new CaseWorksheet(worksheet).validate();

  const rawCaseWorksheet = caseWorksheetEntity.toRawObject();

  await applicationContext.getPersistenceGateway().updateCaseWorksheet({
    applicationContext,
    caseWorksheet: rawCaseWorksheet,
    judgeUserId: judgeUser.userId,
  });

  return rawCaseWorksheet;
};
