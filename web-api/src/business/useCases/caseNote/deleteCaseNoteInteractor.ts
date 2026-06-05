import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { Case } from '@shared/business/entities/cases/Case';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';

const deleteCaseNote = async (
  _applicationContext: ServerApplicationContext,
  { docketNumber }: { docketNumber: string },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_NOTES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const rawCaseToUpdate = await getCaseByDocketNumber({
    docketNumber,
  });

  const caseEntity = new Case(rawCaseToUpdate, { authorizedUser });
  caseEntity.caseNote = undefined;

  const validatedCase = caseEntity.validate().toRawObject();

  await upsertCases([validatedCase]);
};

export const deleteCaseNoteInteractor = withLocking(
  deleteCaseNote,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
