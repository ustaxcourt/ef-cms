import { CaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
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
  }: { docketNumber: string; updatedProps: { [key: string]: string } },
): Promise<void> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_WORKSHEET)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseWorksheet = (await applicationContext
    .getPersistenceGateway()
    .getCaseWorksheet({
      applicationContext,
      docketNumber,
    })) || { docketNumber };

  const caseWorksheetEntity = new CaseWorksheet({
    ...caseWorksheet,
    ...updatedProps,
  }).validate();

  await applicationContext.getPersistenceGateway().updateCaseWorksheet({
    applicationContext,
    caseWorksheet: caseWorksheetEntity.toRawObject(),
    judgeUserId: user.userId,
  });
};
