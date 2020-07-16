import { formatDateIfToday } from './formattedWorkQueue';
import { orderBy } from 'lodash';
import { state } from 'cerebral';

const formatMessage = (message, applicationContext) => {
  return {
    ...message,
    completedAtFormatted: formatDateIfToday(
      message.completedAt,
      applicationContext,
    ),
    createdAtFormatted: formatDateIfToday(
      message.createdAt,
      applicationContext,
    ),
  };
};

const formatAttachment = (
  caseDetail,
  attachment,
  UNSERVABLE_EVENT_CODES,
  draftDocuments,
) => {
  const caseDocument = caseDetail.documents.find(
    document => document.documentId === attachment.documentId,
  );

  if (caseDocument) {
    const isUnservable = UNSERVABLE_EVENT_CODES.includes(
      caseDocument.eventCode,
    );

    const isDraftDocument =
      draftDocuments &&
      !!draftDocuments.find(
        draft => draft.documentId === attachment.documentId,
      );

    attachment.showNotServed =
      !isUnservable && !caseDocument.servedAt && !isDraftDocument;
  }
};

export const formattedMessageDetail = (get, applicationContext) => {
  const messageDetail = get(state.messageDetail);
  const caseDetail = get(state.caseDetail);
  const isExpanded = get(state.isExpanded);

  const { draftDocuments } = applicationContext
    .getUtilities()
    .formatCase(applicationContext, caseDetail);

  const formattedMessages = orderBy(
    messageDetail.map(message => formatMessage(message, applicationContext)),
    'createdAt',
    'desc',
  );
  const { UNSERVABLE_EVENT_CODES } = applicationContext.getConstants();

  const { isCompleted } = formattedMessages[0];

  const currentMessage = formattedMessages[0];

  if (isCompleted) {
    formattedMessages.unshift(currentMessage);
  }

  const hasOlderMessages = formattedMessages.length > 1;

  if (formattedMessages[0].attachments) {
    formattedMessages[0].attachments.map(attachment => {
      formatAttachment(
        caseDetail,
        attachment,
        UNSERVABLE_EVENT_CODES,
        draftDocuments,
      );
    });
  }

  return {
    attachments: formattedMessages[0].attachments,
    currentMessage: formattedMessages[0],
    hasOlderMessages,
    isCompleted,
    olderMessages: formattedMessages.slice(1),
    showActionButtons: !isCompleted,
    showOlderMessages: hasOlderMessages && isExpanded,
  };
};
