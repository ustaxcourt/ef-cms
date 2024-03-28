import { formatDateIfToday } from './formattedWorkQueue';
import { getShowNotServedForDocument } from './getShowNotServedForDocument';
import { orderBy } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

const formatMessage = ({ applicationContext, caseDetail, message }) => {
  const formattedAttachments = applicationContext
    .getUtilities()
    .formatAttachments({
      applicationContext,
      attachments: message.attachments,
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

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const formattedMessageDetail = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const messageDetail = get(state.messageDetail);
  const caseDetail = get(state.caseDetail);
  const isExpanded = get(state.isExpanded);
  const user = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();

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

  const { isCompleted } = formattedMessages[0];

  const currentMessage = formattedMessages[0];

  if (isCompleted) {
    formattedMessages.unshift(currentMessage);
  }

  const hasOlderMessages = formattedMessages.length > 1;

  if (formattedMessages[0].attachments) {
    formattedMessages[0].attachments.map(attachment => {
      attachment.showNotServed = getShowNotServedForDocument({
        caseDetail,
        docketEntryId: attachment.documentId,
        draftDocuments,
      });
    });
  }

  const showActionButtons = !isCompleted && user.role !== USER_ROLES.general;

  return {
    attachments: formattedMessages[0].attachments,
    currentMessage: formattedMessages[0],
    hasOlderMessages,
    isCompleted,
    olderMessages: formattedMessages.slice(1),
    showActionButtons,
    showOlderMessages: hasOlderMessages && isExpanded,
  };
};
