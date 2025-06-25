import { Case } from '@shared/business/entities/cases/Case';
import { MessageResult } from '@shared/business/entities/MessageResult';
import { RawMessage } from '@shared/business/entities/Message';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import {
  NewMessageKysely,
  MessageWithAssociatedCaseDataKysely,
} from '@web-api/persistence/postgres/messages/schema';
import { calculateDate } from '@shared/business/utilities/DateHandler';

export function toKyselyNewMessage(message: RawMessage): NewMessageKysely {
  return {
    attachments: JSON.stringify(message.attachments),
    completedAt: message.completedAt
      ? calculateDate({ dateString: message.completedAt })
      : null,
    completedBy: message.completedBy,
    completedBySection: message.completedBySection,
    completedByUserId: message.completedByUserId,
    completedMessage: message.completedMessage,
    createdAt: calculateDate({ dateString: message.createdAt }),
    docketNumber: message.docketNumber,
    from: message.from,
    fromSection: message.fromSection,
    fromUserId: message.fromUserId,
    isCompleted: message.isCompleted,
    isRead: message.isRead,
    isRepliedTo: message.isRepliedTo,
    message: message.message,
    messageId: message.messageId,
    parentMessageId: message.parentMessageId,
    subject: message.subject,
    to: message.to,
    toSection: message.toSection,
    toUserId: message.toUserId,
  };
}

export function fromKyselyMessage(
  message: MessageWithAssociatedCaseDataKysely,
) {
  return new MessageResult(
    transformNullToUndefined({
      ...message,
      caseStatus: message.status,
      caseTitle: Case.getCaseTitle(message.caption ?? ''),
      completedAt: message.completedAt?.toISOString(),
      createdAt: message.createdAt.toISOString(),
      trialDate: message.trialDate?.toISOString(),
    }),
  );
}
