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
  {
    docketNumber,
    updatedProps,
  }: { docketNumber: string; updatedProps: Record<string, string | undefined> },
): Promise<RawCaseWorksheet> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_WORKSHEET)) {
    throw new UnauthorizedError('Unauthorized');
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
    judgeUserId: user.userId,
  });

  return rawCaseWorksheet;
};
