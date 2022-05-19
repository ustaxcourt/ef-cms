import { DESCENDING } from '../presenterConstants';

//TODO: change name of file??
export const sortFormattedMessages = (formattedCaseMessages, tableSort) => {
  const sortedFormattedMessages = formattedCaseMessages.sort((a, b) => {
    let sortNumber = 0;
    if (!tableSort) {
      sortNumber = a.createdAt.localeCompare(b.createdAt);
    } else if (
      // 'createdAt' = Recieved Column on Inbox Tab and Sent Column on Sent Tab (Outbox)
      // 'completedAt' = Completed COlumn on Completed Tab

      ['createdAt', 'completedAt', 'subject'].includes(tableSort.sortField)
    ) {
      sortNumber = a[tableSort.sortField].localeCompare(b[tableSort.sortField]);
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
    return sortedFormattedMessages.reverse();
  }

  return sortedFormattedMessages;
};

export const sortCompletedMessages = (sortedMessages, tableSort) => {
  const completedMessages = sortedMessages.filter(
    message => message.isCompleted,
  );

  if (!tableSort) {
    return completedMessages.sort((a, b) =>
      b.completedAt.localeCompare(a.completedAt),
    );
  }

  return completedMessages;
};
