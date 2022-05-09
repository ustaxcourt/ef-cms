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
      let sortNumber = 0;
      if (
        ['createdAt', 'completedAt', 'subject'].includes(tableSort.sortField)
      ) {
        sortNumber = a[tableSort.sortField].localeCompare(
          b[tableSort.sortField],
        );
      } else if (tableSort.sortField === 'docketNumber') {
        const aSplit = a.docketNumber.split('-');
        const bSplit = b.docketNumber.split('-');

        if (aSplit[1] !== bSplit[1]) {
          // compare years if they aren't the same;
          // compare as strings, because they *might* have suffix
          sortNumber = aSplit[1].localeCompare(bSplit[1]);
        } else {
          // compare index if years are the same, compare as integers
          sortNumber = +aSplit[0] - +bSplit[0];
        }
      }
      return sortNumber;
    });

  if (tableSort.sortOrder === 'desc') {
    formattedCaseMessages.reverse();
  }

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
  const tableSort = get(state.tableSort);

  const { completedMessages, messages } = getFormattedMessages({
    applicationContext,
    messages: get(state.messages) || [],
    tableSort,
  });

  const { box, section } = get(state.messageBoxToDisplay);
  console.log(get(state.messageBoxToDisplay));
  const userRole = get(state.user.role);

  if (box === 'outbox' && section === 'section' && userRole !== 'adc') {
    messages.reverse();
  }

  return {
    completedMessages,
    messages,
  };
};
