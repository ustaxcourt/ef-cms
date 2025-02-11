import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { CaseDeadline } from '@shared/business/entities/CaseDeadline';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { getCasesMetadataByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesMetadataByDocketNumbers';
import { getCaseDeadlinesByDateRange } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDateRange';
import { pick } from 'lodash';
import { Case } from '@shared/business/entities/cases/Case';
import { getLogger } from '@web-api/utilities/logger/getLogger';

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
    judge,
    startDate,
  }: {
    endDate: string;
    judge: string;
    startDate;
  },
  authorizedUser: UnknownAuthUser,
): Promise<{ deadlines: CaseDeadlineResponseInfo[] }> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { foundDeadlines } = await getCaseDeadlinesByDateRange({
    endDate,
    judge,
    pageSize: undefined,
    startDate,
  });

  const validatedCaseDeadlines =
    CaseDeadline.validateRawCollection(foundDeadlines);

  const associatedCases = await getCasesMetadataByDocketNumbers({
    docketNumbers: validatedCaseDeadlines.map(item => item.docketNumber),
  });

  const validAssociatedCases = associatedCases?.filter(rawCase => {
    const caseEntity = new Case(rawCase, { authorizedUser });
    try {
      caseEntity.validate();
      return true;
    } catch (err) {
      getLogger().error(
        `getCasesByDocketNumber: case ${caseEntity.docketNumber} failed validation`,
        {
          message: caseEntity.getFormattedValidationErrors(),
        },
      );
      return false;
    }
  });

  const deadlinesWithFullInfo: CaseDeadlineResponseInfo[] = [];
  for (const deadline of validatedCaseDeadlines) {
    const validCase = validAssociatedCases?.find(
      c => c.docketNumber === deadline.docketNumber,
    );
    if (!validCase) {
      continue;
    }
    deadlinesWithFullInfo.push({
      ...deadline,
      ...pick(validCase, [
        'caseCaption',
        'docketNumber',
        'docketNumberSuffix',
        'docketNumberWithSuffix',
        'leadDocketNumber',
      ]),
    });
  }

  return { deadlines: deadlinesWithFullInfo };
};
