import {
  CaseWorksheet,
  RawCaseWorksheet,
} from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

export const getCaseWorksheetsForJudgeInteractor = async (
  applicationContext: IApplicationContext,
): Promise<RawCaseWorksheet[]> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_WORKSHEET)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const judgeUser = await applicationContext
    .getUseCaseHelpers()
    .getJudgeForUserHelper(applicationContext, { user });

  const rawWorksheets = await applicationContext
    .getPersistenceGateway()
    .getCaseWorksheets(applicationContext, {
      judgeId: judgeUser.userId,
    });

  return CaseWorksheet.validateRawCollection(rawWorksheets, {
    applicationContext,
  });
};
