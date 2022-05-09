import { formatDateIfToday } from './formattedWorkQueue';
import { state } from 'cerebral';

export const getFormattedMessages = ({
  applicationContext,
  messages,
  tableSort,
}) => {
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
      // TODO: localeCompare only works for dates
      // TODO: find a elegant way to sort by values
      if (
        ['createdAt', 'completedAt', 'subject'].includes(tableSort.sortField)
      ) {
        return a[tableSort.sortField].localeCompare(b[tableSort.sortField]);
      } else if (tableSort.sortField === 'docketNumber') {
        const aSplit = a.docketNumber.split('-');
        const bSplit = b.docketNumber.split('-');

        if (aSplit[1] !== bSplit[1]) {
          // compare years if they aren't the same;
          // compare as strings, because they *might* have suffix
          return aSplit[1].localeCompare(bSplit[1]);
        } else {
          // compare index if years are the same, compare as integers
          return +aSplit[0] - +bSplit[0];
        }
        // return a[tableSort.sortField].localeCompare(b[tableSort.sortField]);
      }
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

  const currentMessageBox = get(state.messageBoxToDisplay.box);

  if (currentMessageBox === 'outbox') {
    messages.reverse();
  }

  return {
    completedMessages,
    messages,
  };
};
