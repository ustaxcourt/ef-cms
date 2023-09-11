import {
  CaseWorksheet,
  RawCaseWorksheet,
} from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { User } from '@shared/business/entities/User';

export const updateCaseWorksheetInteractor = async (
  applicationContext: IApplicationContext,
  {
    docketNumber,
    updatedProps,
  }: {
    docketNumber: string;
    updatedProps: Record<string, string | undefined>;
  },
): Promise<RawCaseWorksheet> => {
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

  const caseWorksheet = await applicationContext
    .getPersistenceGateway()
    .getCaseWorksheet({
      applicationContext,
      docketNumber,
    });

  const caseWorksheetEntity = new CaseWorksheet({
    ...caseWorksheet,
    ...updatedProps,
    docketNumber,
  }).validate();

  const rawCaseWorksheet = caseWorksheetEntity.toRawObject();

  await applicationContext.getPersistenceGateway().updateCaseWorksheet({
    applicationContext,
    caseWorksheet: rawCaseWorksheet,
    judgeUserId: judgeUser ? judgeUser.userId : userEntity.userId,
  });

  return rawCaseWorksheet;
};
