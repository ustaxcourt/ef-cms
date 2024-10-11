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
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { updateCaseWorksheet } from '@web-api/persistence/postgres/caseWorksheet/updateCaseWorksheet';

export const updateCaseWorksheetInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    worksheet,
  }: {
    worksheet: RawCaseWorksheet;
  },
  authorizedUser: UnknownAuthUser,
): Promise<RawCaseWorksheet> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_WORKSHEET)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const judgeUser = await applicationContext
    .getUseCaseHelpers()
    .getJudgeForUserHelper(applicationContext, { user: authorizedUser });

  const caseWorksheetEntity = new CaseWorksheet(worksheet).validate();

  const rawCaseWorksheet = caseWorksheetEntity.toRawObject();

  await updateCaseWorksheet({
    caseWorksheet: rawCaseWorksheet,
    judgeUserId: judgeUser.userId,
  });

  return rawCaseWorksheet;
};
