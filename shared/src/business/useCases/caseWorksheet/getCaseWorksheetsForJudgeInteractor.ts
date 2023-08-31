import {
  CaseWorksheet,
  RawCaseWorksheet,
} from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';

export const getCaseWorksheetsForJudgeInteractor = async (
  applicationContext: IApplicationContext,
): Promise<RawCaseWorksheet[]> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_WORKSHEET)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const rawWorksheets = await applicationContext
    .getPersistenceGateway()
    .getCaseWorksheets(applicationContext, { judgeId: user.userId });

  return CaseWorksheet.validateRawCollection(rawWorksheets, {
    applicationContext,
  });
};
