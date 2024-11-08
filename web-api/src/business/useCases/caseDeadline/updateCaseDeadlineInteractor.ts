import { CaseDeadline } from '../../../../../shared/src/business/entities/CaseDeadline';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { upsertCaseDeadline } from '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadline';

export const updateCaseDeadlineInteractor = async (
  { caseDeadline }: { caseDeadline: CaseDeadline },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized for updating case deadline');
  }

  const caseDeadlineToUpdate = new CaseDeadline(caseDeadline)
    .validate()
    .toRawObject();

  await upsertCaseDeadline({
    caseDeadlineToUpsert: caseDeadlineToUpdate,
  });

  return caseDeadlineToUpdate;
};
