import { formatDateIfToday } from './formattedWorkQueue';
import { getShowNotServedForDocument } from './getShowNotServedForDocument';
import { orderBy } from 'lodash';
import { state } from 'cerebral';

const formatMessage = ({ applicationContext, caseDetail, message }) => {
  const formattedAttachments = applicationContext
    .getUtilities()
    .formatAttachments({
      applicationContext,
      attachments: message.attachments || [],
      caseDetail,
    });
  return {
    ...message,
    attachments: formattedAttachments,
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
    messageDetail.map(message =>
      formatMessage({ applicationContext, caseDetail, message }),
    ),
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
        docketEntryId: attachment.documentId,
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
