import { Case } from '@shared/business/entities/cases/Case';
import { NewWorkItemKysely } from '@web-api/database-types';
import { RawWorkItem, WorkItem } from '@shared/business/entities/WorkItem';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

function pickFields(workItem) {
  return {
    assigneeId: workItem.assigneeId,
    assigneeName: workItem.assigneeName,
    associatedJudge: workItem.associatedJudge,
    associatedJudgeId: workItem.associatedJudgeId,
    caseIsInProgress: workItem.caseIsInProgress,
    caseStatus: workItem.caseStatus,
    caseTitle: workItem.caseTitle,
    completedAt: workItem.completedAt,
    completedBy: workItem.completedBy,
    completedByUserId: workItem.completedByUserId,
    completedMessage: workItem.completedMessage,
    createdAt: workItem.createdAt,
    docketEntry: JSON.stringify(workItem.docketEntry),
    docketNumber: workItem.docketNumber,
    docketNumberWithSuffix: workItem.docketNumberWithSuffix,
    hideFromPendingMessages: workItem.hideFromPendingMessages,
    highPriority: workItem.highPriority,
    inProgress: workItem.inProgress,
    isInitializeCase: workItem.isInitializeCase,
    isRead: workItem.isRead,
    leadDocketNumber: workItem.leadDocketNumber,
    section: workItem.section,
    sentBy: workItem.sentBy,
    sentBySection: workItem.sentBySection,
    sentByUserId: workItem.sentByUserId,
    trialDate: workItem.trialDate,
    trialLocation: workItem.trialLocation,
    updatedAt: workItem.updatedAt,
    workItemId: workItem.workItemId,
  };
}

// export function toKyselyUpdateMessage(
//   message: RawMessage,
// ): UpdateMessageKysely {
//   return pickFields(message);
// }

// export function toKyselyUpdateMessages(
//   messages: RawMessage[],
// ): UpdateMessageKysely[] {
//   return messages.map(pickFields);
// }

export function toKyselyNewWorkItem(workItem: RawWorkItem): NewWorkItemKysely {
  return pickFields(workItem);
}

// export function toKyselyNewMessages(
//   messages: RawMessage[],
// ): NewMessageKysely[] {
//   return messages.map(pickFields);
// }

export function workItemEntity(workItem) {
  return new WorkItem(
    transformNullToUndefined({
      ...workItem,
      caseStatus: workItem.status,
      caseTitle: Case.getCaseTitle(workItem.caption),
    }),
  );
}
