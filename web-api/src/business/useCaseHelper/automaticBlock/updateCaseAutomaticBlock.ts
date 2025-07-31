import { Case } from '@shared/business/entities/cases/Case';
import { getCaseDeadlinesByDocketNumber } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { isEmpty } from 'lodash';
import { SIGNED_DOCUMENT_TYPES } from '@shared/business/entities/EntityConstants';

export const updateCaseAutomaticBlock = async ({
  caseEntity,
  hasCaseDeadline,
}: {
  caseEntity: Case;
  hasCaseDeadline?: boolean;
}) => {
  const docketedStipulatedDecision = caseEntity.docketEntries.find(
    de =>
      de.eventCode ===
        SIGNED_DOCUMENT_TYPES.signedStipulatedDecision.eventCode &&
      de.isOnDocketRecord,
  );

  if (caseEntity.trialDate && !docketedStipulatedDecision) return caseEntity;

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
