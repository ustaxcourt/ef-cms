import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { CaseDeadline } from '@shared/business//entities/CaseDeadline';
import {
  CASE_DEADLINES_REPORT_PAGE_SIZE,
  CHIEF_JUDGE,
} from '@shared/business//entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { getCaseDeadlinesByDateRange } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDateRange';
import { pick } from 'lodash';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';

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
    judgeId,
    startDate,
  }: {
    endDate: string;
    from: number;
    judgeId: string;
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
    judgeId: getJudgeIdForPersistence(judgeId),
    pageSize: CASE_DEADLINES_REPORT_PAGE_SIZE,
    startDate,
  });

  const validatedCaseDeadlines =
    CaseDeadline.validateRawCollection(foundDeadlines);

  const associatedCases = await getCasesByDocketNumbers({
    docketNumbers: validatedCaseDeadlines.map(item => item.docketNumber),
    excludeFields: ['docketEntries', 'hearings', 'correspondence'],
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

  return { deadlines: deadlinesWithFullInfo, totalCount };
};

const getJudgeIdForPersistence = (
  judgeId: string | undefined,
): string | undefined | null => {
  return judgeId === CHIEF_JUDGE ? null : judgeId;
};
