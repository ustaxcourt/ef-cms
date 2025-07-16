import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { UnauthorizedError } from '@web-api/errors/errors';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import { getCaseDeadlinesByConsolidatedCaseDeadlineId } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineId';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';

export async function getConsolidatedCaseDeadlinesInteractor(
  {
    consolidatedCaseDeadlineId,
  }: {
    consolidatedCaseDeadlineId: string;
  },
  authorizedUser: UnknownAuthUser,
): Promise<{ docketNumber: string; caseCaption: string }[]> {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const DEADLINES = await getCaseDeadlinesByConsolidatedCaseDeadlineId(
    consolidatedCaseDeadlineId,
  );

  if (!DEADLINES.length) return [];

  const ALL_CASES = await getCasesByDocketNumbers({
    docketNumbers: DEADLINES.map(c => c.docketNumber),
  });

  return ALL_CASES.map(c => ({
    caseCaption: c.caseCaption,
    docketNumber: c.docketNumber,
  }));
}
