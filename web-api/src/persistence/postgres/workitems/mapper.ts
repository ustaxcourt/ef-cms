import { NewWorkItemKysely } from '@web-api/database-types';
import { RawWorkItem } from '@shared/business/entities/WorkItem';

function pickFields(workItem) {
  return {
    docketEntry: JSON.stringify(workItem.docketEntry),
    workItemId: workItem.workItemId,
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
