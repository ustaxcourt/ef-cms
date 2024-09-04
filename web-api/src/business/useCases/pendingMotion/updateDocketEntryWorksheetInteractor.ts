import {
  DocketEntryWorksheet,
  RawDocketEntryWorksheet,
} from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const updateDocketEntryWorksheetInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    worksheet,
  }: {
    worksheet: RawDocketEntryWorksheet;
  },
  authorizedUser: UnknownAuthUser,
): Promise<RawDocketEntryWorksheet> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY_WORKSHEET)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const judgeUser = await applicationContext
    .getUseCaseHelpers()
    .getJudgeForUserHelper(applicationContext, { user: authorizedUser });

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
