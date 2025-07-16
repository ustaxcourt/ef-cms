import { Case } from '@shared/business/entities/cases/Case';
import { getCaseDeadlinesByDocketNumber } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { isEmpty } from 'lodash';

export const updateCaseAutomaticBlock = async ({
  caseEntity,
  hasCaseDeadline,
}: {
  caseEntity: Case;
  hasCaseDeadline?: boolean;
}) => {
  if (caseEntity.trialDate || caseEntity.highPriority) {
    return caseEntity;
  }

  if (hasCaseDeadline === undefined) {
    hasCaseDeadline = !isEmpty(
      await getCaseDeadlinesByDocketNumber({
        docketNumber: caseEntity.docketNumber,
      }),
    );
  }

  caseEntity.updateAutomaticBlocked({ hasCaseDeadline });

  return caseEntity;
};
