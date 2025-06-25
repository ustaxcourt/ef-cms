import {
  CaseDeadline,
  RawCaseDeadline,
} from '@shared/business/entities/CaseDeadline';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { NewCaseDeadlineKysely } from '@web-api/persistence/postgres/caseDeadlines/schema';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export function toKyselyNewCaseDeadline(
  deadline: RawCaseDeadline,
): NewCaseDeadlineKysely {
  return {
    associatedJudge: deadline.associatedJudge,
    associatedJudgeId: deadline.associatedJudgeId,
    caseDeadlineId: deadline.caseDeadlineId,
    createdAt: calculateDate({ dateString: deadline.createdAt }),
    deadlineDate: calculateDate({ dateString: deadline.deadlineDate }),
    description: deadline.description,
    docketNumber: deadline.docketNumber,
    sortableDocketNumber: deadline.sortableDocketNumber,
  };
}

export function fromCaseDeadlineKysely(caseDeadline) {
  return new CaseDeadline(
    transformNullToUndefined({
      ...caseDeadline,
      createdAt: caseDeadline.createdAt.toISOString(),
      deadlineDate: caseDeadline.deadlineDate?.toISOString(),
    }),
  );
}
