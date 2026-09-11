import { Case } from '@shared/business/entities/cases/Case';
import {
  AUTOMATIC_BLOCKED_REASONS,
  AutomaticBlockedReasons,
} from '@shared/business/entities/EntityConstants';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { getCaseDeadlinesByDocketNumber } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { isEmpty } from 'lodash';

export const updateCaseAutomaticBlock = async ({
  caseEntity,
  hasCaseDeadline,
}: {
  caseEntity: Case;
  hasCaseDeadline?: boolean;
}): Promise<Case> => {
  if (hasCaseDeadline === undefined && !caseEntity.trialDate) {
    hasCaseDeadline = !isEmpty(
      await getCaseDeadlinesByDocketNumber({
        docketNumber: caseEntity.docketNumber,
      }),
    );
  }

  caseEntity.hasPendingItems = caseEntity.doesHavePendingItems();

  // a case set for trial is never automatically blocked, regardless of pending items or deadlines
  if (caseEntity.trialDate) {
    setAutomaticBlock(caseEntity);
    return caseEntity;
  }

  let automaticBlockedReason: AutomaticBlockedReasons | undefined;
  if (caseEntity.hasPendingItems && hasCaseDeadline) {
    automaticBlockedReason = AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate;
  } else if (caseEntity.hasPendingItems) {
    automaticBlockedReason = AUTOMATIC_BLOCKED_REASONS.pending;
  } else if (hasCaseDeadline) {
    automaticBlockedReason = AUTOMATIC_BLOCKED_REASONS.dueDate;
  }

  setAutomaticBlock(caseEntity, automaticBlockedReason);

  return caseEntity;
};

const setAutomaticBlock = (
  caseEntity: Case,
  reason?: AutomaticBlockedReasons,
): void => {
  caseEntity.automaticBlocked = !!reason;
  caseEntity.automaticBlockedDate = reason ? createISODateString() : undefined;
  caseEntity.automaticBlockedReason = reason;

  caseEntity.consolidatedCases.forEach(c => {
    if (c.docketNumber === caseEntity.docketNumber) {
      c.automaticBlocked = caseEntity.automaticBlocked;
    }
  });
};
