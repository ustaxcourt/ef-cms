import {
  CaseDeadline,
  RawCaseDeadline,
} from '@shared/business/entities/CaseDeadline';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { upsertCaseDeadlines } from '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines';
import { getCaseDeadlinesByConsolidatedCaseDeadlineId } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineId';

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

  const consolidatedCaseDeadlines: RawCaseDeadline[] =
    await getCaseDeadlinesByConsolidatedCaseDeadlineId(
      caseDeadlineToUpdate.caseDeadlineId,
      caseDeadlineToUpdate.docketNumber,
    );

  const updatedConsolidatedCaseDeadlines: RawCaseDeadline[] =
    consolidatedCaseDeadlines
      .filter(
        ({ docketNumber: ccDocketNumber }) =>
          ccDocketNumber !== caseDeadlineToUpdate.docketNumber,
      )
      .map(ccd =>
        new CaseDeadline({
          ...ccd,
          createdAt: caseDeadlineToUpdate.createdAt,
          deadlineDate: caseDeadlineToUpdate.deadlineDate,
          description: caseDeadlineToUpdate.description,
        })
          .validate()
          .toRawObject(),
      );

  await upsertCaseDeadlines([
    caseDeadlineToUpdate,
    ...updatedConsolidatedCaseDeadlines,
  ]);

  return caseDeadlineToUpdate;
};
