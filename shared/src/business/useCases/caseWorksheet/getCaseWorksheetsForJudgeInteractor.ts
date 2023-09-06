import {
  CaseWorksheet,
  RawCaseWorksheet,
} from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';
import { User } from '@shared/business/entities/User';

export const getCaseWorksheetsForJudgeInteractor = async (
  applicationContext: IApplicationContext,
): Promise<RawCaseWorksheet[]> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_WORKSHEET)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const rawUser = await applicationContext.getPersistenceGateway().getUserById({
    applicationContext,
    userId: user.userId,
  });

  const userEntity = new User(rawUser);

  let judgeUser;
  if (userEntity.isChambersUser() && !userEntity.isJudgeUser()) {
    judgeUser = await applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper(applicationContext, {
        section: userEntity.section,
      });
  }

  const rawWorksheets = await applicationContext
    .getPersistenceGateway()
    .getCaseWorksheets(applicationContext, {
      judgeId: judgeUser ? judgeUser.userId : userEntity.userId,
    });

  return CaseWorksheet.validateRawCollection(rawWorksheets, {
    applicationContext,
  });
};
