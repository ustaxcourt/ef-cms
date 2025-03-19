import { Correspondence } from '@shared/business/entities/Correspondence';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const DW_CASE_CORRESPONDENCE_COLUMNS = [
  'archived',
  'correspondenceId',
  'documentTitle',
  'filedBy',
  'filingDate',
  'userId',
  'docketNumber',
];

export function caseCorrespondenceEntity(caseCorrespondence) {
  return new Correspondence(
    transformNullToUndefined({
      ...caseCorrespondence,
      filingDate: caseCorrespondence.filingDate.toISOString(),
    }),
  );
}
