import {
  DocketEntryWorksheet,
  RawDocketEntryWorksheet,
} from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { upsertDocketEntryWorksheets } from '@web-api/persistence/postgres/docketEntryWorksheets/upsertDocketEntryWorksheets';

export const updateDocketEntryWorksheetInteractor = async (
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

  const docketEntryWorksheetEntity = new DocketEntryWorksheet(
    worksheet,
  ).validate();

  const rawDocketEntryWorksheet = docketEntryWorksheetEntity.toRawObject();

  await upsertDocketEntryWorksheets({
    docketEntryWorksheets: [rawDocketEntryWorksheet],
  });

  return rawDocketEntryWorksheet;
};
