import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { CaseDeadline } from '@shared/business//entities/CaseDeadline';
import { CASE_DEADLINES_REPORT_PAGE_SIZE } from '@shared/business//entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { getCasesMetadataByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesMetadataByDocketNumbers';
import { getCaseDeadlinesByDateRange } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDateRange';
import { pick } from 'lodash';

type CaseDeadlineResponseInfo = {
  associatedJudge: string;
  caseCaption?: string;
  caseDeadlineId: string;
  createdAt: string;
  deadlineDate: string;
  description: string;
  docketNumber: string;
  docketNumberWithSuffix?: string;
  sortableDocketNumber: number;
};

export const getCaseDeadlinesInteractor = async (
  {
    endDate,
    from,
    judge,
    startDate,
  }: {
    endDate: string;
    from: number;
    judge: string;
    startDate;
  },
  authorizedUser: UnknownAuthUser,
): Promise<{ deadlines: CaseDeadlineResponseInfo[]; totalCount: number }> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { foundDeadlines, totalCount } = await getCaseDeadlinesByDateRange({
    endDate,
    from,
    judge,
    pageSize: CASE_DEADLINES_REPORT_PAGE_SIZE,
    startDate,
  });

  const validatedCaseDeadlines =
    CaseDeadline.validateRawCollection(foundDeadlines);

  const associatedCases = await getCasesMetadataByDocketNumbers({
    docketNumbers: validatedCaseDeadlines.map(item => item.docketNumber),
  });

  const deadlinesWithFullInfo: CaseDeadlineResponseInfo[] = [];
  for (const deadline of validatedCaseDeadlines) {
    deadlinesWithFullInfo.push({
      ...deadline,
      ...pick(
        associatedCases?.find(c => c.docketNumber === deadline.docketNumber),
        [
          'caseCaption',
          'docketNumber',
          'docketNumberSuffix',
          'docketNumberWithSuffix',
          'leadDocketNumber',
        ],
      ),
    });
  }

  return { deadlines: deadlinesWithFullInfo, totalCount: Number(totalCount) };
};
