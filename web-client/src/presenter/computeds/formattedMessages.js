import { formatDateIfToday } from './formattedWorkQueue';
import { map, uniq } from 'lodash';
import { state } from 'cerebral';

export const getFormattedMessages = ({ applicationContext, messages }) => {
  const formattedCaseMessages = messages
    .map(message => ({
      ...message,
      completedAtFormatted: formatDateIfToday(
        message.completedAt,
        applicationContext,
      ),
      createdAtFormatted: formatDateIfToday(
        message.createdAt,
        applicationContext,
      ),
      messageDetailLink: `/messages/${message.docketNumber}/message-detail/${message.parentMessageId}`,
    }))
    .sort((a, b) => {
      return a.createdAt.localeCompare(b.createdAt);
    });

  const inProgressMessages = formattedCaseMessages.filter(
    message => !message.isRepliedTo && !message.isCompleted,
  );
  const completedMessages = formattedCaseMessages.filter(
    message => message.isCompleted,
  );

  completedMessages.sort((a, b) => b.completedAt.localeCompare(a.completedAt));

  return {
    completedMessages,
    inProgressMessages,
    messages: formattedCaseMessages,
  };
};

export const formattedMessages = (get, applicationContext) => {
  const { completedMessages, messages } = getFormattedMessages({
    applicationContext,
    messages: get(state.messages) || [],
  });

  const caseStatuses = uniq(map(messages, 'caseStatus'));
  const toUsers = uniq(map(messages, 'to'));
  const fromUsers = uniq(map(messages, 'from'));
  const fromSections = uniq(map(messages, 'fromSection'));

  const currentMessageBox = get(state.messageBoxToDisplay.box);

  if (currentMessageBox === 'outbox') {
    messages.reverse();
  }

  return {
    caseStatuses,
    completedMessages,
    fromSections,
    fromUsers,
    messages,
    toUsers,
  };
};
