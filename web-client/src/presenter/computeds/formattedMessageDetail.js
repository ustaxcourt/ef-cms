import { formatDateIfToday } from './formattedWorkQueue';
import { getShowNotServedForDocument } from './getShowNotServedForDocument';
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
      attachment.showNotServed = getShowNotServedForDocument({
        UNSERVABLE_EVENT_CODES,
        caseDetail,
        documentId: attachment.documentId,
        draftDocuments,
      });
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
