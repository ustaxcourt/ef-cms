import {
  Correspondence,
  RawCorrespondence,
} from '@shared/business/entities/Correspondence';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import {
  CaseCorrespondenceKysely,
  NewCaseCorrespondenceKysely,
} from '@web-api/persistence/postgres/caseCorrespondences/schema';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export function toKyselyNewCaseCorrespondence(
  correspondence: RawCorrespondence,
): NewCaseCorrespondenceKysely {
  return {
    archived: correspondence.archived,
    correspondenceId: correspondence.correspondenceId,
    docketNumber: correspondence.docketNumber!,
    documentTitle: correspondence.documentTitle,
    filedBy: correspondence.filedBy,
    filingDate: calculateDate({ dateString: correspondence.filingDate }),
    userId: correspondence.userId,
  };
}

export function fromKyselyCaseCorrespondence(
  caseCorrespondence: CaseCorrespondenceKysely,
) {
  return new Correspondence(
    transformNullToUndefined({
      ...caseCorrespondence,
      filingDate: caseCorrespondence.filingDate.toISOString(),
    }),
  );
}
