import { DESCENDING } from '../presenterConstants';
import { formatDateIfToday } from './formattedWorkQueue';
import { state } from 'cerebral';

export const getFormattedMessages = ({
  applicationContext,
  messages,
  tableSort,
}) => {
  // TODO: refactor this whole function
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
      if (!tableSort) {
        sortNumber = a.createdAt.localeCompare(b.createdAt);
      } else if (
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

  if (tableSort && tableSort.sortOrder === DESCENDING) {
    formattedCaseMessages.reverse();
  }

  const inProgressMessages = formattedCaseMessages.filter(
    message => !message.isRepliedTo && !message.isCompleted,
  );
  const completedMessages = formattedCaseMessages.filter(
    message => message.isCompleted,
  );

  if (!tableSort) {
    completedMessages.sort((a, b) =>
      b.completedAt.localeCompare(a.completedAt),
    );
  }

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
  const { role } = get(state.user);

  const { USER_ROLES } = applicationContext.getConstants();

  if (box === 'outbox' && section === 'section' && role !== USER_ROLES.adc) {
    messages.reverse();
  }

  return {
    completedMessages,
    messages,
    showSortableHeaders: role === USER_ROLES.adc,
  };
};
