import { formatDateIfToday } from './formattedWorkQueue';
import { orderBy } from 'lodash';
import { state } from 'cerebral';

const formatMessage = (message, applicationContext) => {
  return {
    ...message,
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

  const hasOlderMessages = formattedMessages.length > 1;

  return {
    attachments: formattedMessages[0].attachments,
    currentMessage: formattedMessages[0],
    hasOlderMessages,
    olderMessages: formattedMessages.slice(1),
    showOlderMessages: hasOlderMessages && isExpanded,
  };
};
