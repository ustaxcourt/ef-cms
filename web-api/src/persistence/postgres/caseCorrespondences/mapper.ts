import { Correspondence } from '@shared/business/entities/Correspondence';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export function caseCorrespondenceEntity(caseCorrespondence) {
  return new Correspondence(
    transformNullToUndefined({
      ...caseCorrespondence,
      filingDate: caseCorrespondence.filingDate.toISOString(),
    }),
  );
}
