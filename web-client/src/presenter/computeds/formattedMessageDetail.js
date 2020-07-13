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

export const formattedMessageDetail = (get, applicationContext) => {
  const messageDetail = get(state.messageDetail);
  const isExpanded = get(state.isExpanded);

  const formattedMessages = orderBy(
    messageDetail.map(message => formatMessage(message, applicationContext)),
    'createdAt',
    'desc',
  );

  const { isCompleted } = formattedMessages[0];

  const currentMessage = formattedMessages[0];

  if (isCompleted) {
    formattedMessages.unshift(currentMessage);
  }

  const hasOlderMessages = formattedMessages.length > 1;

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
