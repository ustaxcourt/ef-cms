import {
  CaseWorksheet,
  RawCaseWorksheet,
} from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { upsertCaseWorksheets } from '@web-api/persistence/postgres/caseWorksheets/upsertCaseWorksheets';

export const updateCaseWorksheetInteractor = async (
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

  const caseWorksheetEntity = new CaseWorksheet(worksheet).validate();

  const rawCaseWorksheet = caseWorksheetEntity.toRawObject();

  await upsertCaseWorksheets([rawCaseWorksheet]);

  return rawCaseWorksheet;
};
