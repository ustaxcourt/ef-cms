import {
  DocketEntryWorksheet,
  RawDocketEntryWorksheet,
} from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

export const updateDocketEntryWorksheetInteractor = async (
  applicationContext: IApplicationContext,
  {
    worksheet,
  }: {
    worksheet: RawDocketEntryWorksheet;
  },
): Promise<RawDocketEntryWorksheet> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.DOCKET_ENTRY_WORKSHEET)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const judgeUser = await applicationContext
    .getUseCaseHelpers()
    .getJudgeForUserHelper(applicationContext, { user });

  const docketEntryWorksheetEntity = new DocketEntryWorksheet(
    worksheet,
  ).validate();

  const rawDocketEntryWorksheet = docketEntryWorksheetEntity.toRawObject();

  await applicationContext.getPersistenceGateway().updateDocketEntryWorksheet({
    applicationContext,
    docketEntryWorksheet: rawDocketEntryWorksheet,
    judgeUserId: judgeUser.userId,
  });

  return rawDocketEntryWorksheet;
};
