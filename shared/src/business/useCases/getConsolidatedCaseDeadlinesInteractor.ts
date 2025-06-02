import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { UnauthorizedError } from '@web-api/errors/errors';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import { getCaseDeadlinesByConsolidatedCaseDeadlineId } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineId';
import { getCaseMetadataByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseMetadataByDocketNumber';

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

  const RESULTS: { docketNumber: string; caseCaption: string }[] = [];
  for (let index = 0; index < DEADLINES.length; index++) {
    const { docketNumber } = DEADLINES[index];
    const CASE = await getCaseMetadataByDocketNumber({
      docketNumber,
    });
    if (!CASE) continue;

    const { caseCaption } = CASE;
    RESULTS.push({
      caseCaption,
      docketNumber,
    });
  }

  return RESULTS;
}
