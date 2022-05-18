export const sortFormattedMessages = (formattedCaseMessages, tableSort) => {
  return formattedCaseMessages.sort((a, b) => {
    let sortNumber = 0;
    if (!tableSort) {
      sortNumber = a.createdAt.localeCompare(b.createdAt);
      console.log('sortNumber in if branch*** ', sortNumber);
    } else if (
      // 'createdAt' = Recieved Column on Inbox Tab and Sent Column on Sent Tab (Outbox)
      // 'completedAt' = Completed COlumn on Completed Tab

      ['createdAt', 'completedAt', 'subject'].includes(tableSort.sortField)
    ) {
      sortNumber = a[tableSort.sortField].localeCompare(b[tableSort.sortField]);
      console.log('sortNumber in first else if branch*** ', sortNumber);
    } else if (tableSort.sortField === 'docketNumber') {
      const aSplit = a.docketNumber.split('-');
      const bSplit = b.docketNumber.split('-');

      if (aSplit[1] !== bSplit[1]) {
        // compare years if they aren't the same;
        // compare as strings, because they *might* have suffix
        sortNumber = aSplit[1].localeCompare(bSplit[1]);
        console.log('sortNumber in docketNumber if branch*** ', sortNumber);
      } else {
        // compare index if years are the same, compare as integers
        sortNumber = +aSplit[0] - +bSplit[0];
        console.log('sortNumber in docketNumber else branch*** ', sortNumber);
      }
    }
    return sortNumber;
  });
};
