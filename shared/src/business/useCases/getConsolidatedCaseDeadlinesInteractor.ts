import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { UnauthorizedError } from '@web-api/errors/errors';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import { getCaseDeadlinesByConsolidatedCaseDeadlineId } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineId';
import { getCaseByDocketNumberPostgres } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';

export async function getConsolidatedCaseDeadlinesInteractor(
  _applicationContext: IApplicationContext,
  {
    consolidatedCaseDeadlineId,
  }: {
    consolidatedCaseDeadlineId: string;
  },
  authorizedUser: UnknownAuthUser,
) {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const DEADLINES = await getCaseDeadlinesByConsolidatedCaseDeadlineId(
    consolidatedCaseDeadlineId,
  );

  const RESULTS: any[] = [];
  for (let index = 0; index < DEADLINES.length; index++) {
    const { docketNumber } = DEADLINES[index];
    const [{ caption }] = await getCaseByDocketNumberPostgres(docketNumber);
    RESULTS.push({
      caption,
      docketNumber,
    });
  }

  return RESULTS;
}
