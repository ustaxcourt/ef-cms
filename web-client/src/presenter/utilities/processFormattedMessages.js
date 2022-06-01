import { DESCENDING } from '../presenterConstants';
import { formatDateIfToday } from '../computeds/formattedWorkQueue';

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

// useful for users that have a large amount of messages (ADC Users) since
// recalculating the formatted date fields is expensive.
let messageCache = null;
let lastCacheKey = null;

export const getFormattedMessages = ({
  applicationContext,
  messages,
  tableSort,
  cacheKey = applicationContext.getUniqueId(),
}) => {
  // We cache these results because recalculating these dates takes a lot of time.
  // this cache is cleared from the resetCacheKeyAction whenever a user changes their displayed
  // queue & section type.
  if (cacheKey !== lastCacheKey) {
    // we calculate these outside of the .map function because calling them 3000 times (ADC User)
    // takes a lot of time due to the nature of doing string / date logic.
    const now = applicationContext.getUtilities().formatNow('MMDDYY');
    const yesterday = applicationContext.getUtilities().formatDateString(
      applicationContext.getUtilities().calculateISODate({
        howMuch: -1,
      }),
      'MMDDYY',
    );
    const formattedMessages = messages.map(message => {
      const inConsolidatedGroup = !!message.leadDocketNumber;

      return {
        ...message,
        completedAtFormatted: formatDateIfToday(
          message.completedAt,
          applicationContext,
          now,
          yesterday,
        ),
        createdAtFormatted: formatDateIfToday(
          message.createdAt,
          applicationContext,
          now,
          yesterday,
        ),
        inConsolidatedGroup,
        inLeadCase:
          inConsolidatedGroup &&
          message.leadDocketNumber === message.docketNumber,
        messageDetailLink: `/messages/${message.docketNumber}/message-detail/${message.parentMessageId}`,
      };
    });
    messageCache = formattedMessages;
    lastCacheKey = cacheKey;
  }

  const sortedMessages = sortFormattedMessages(messageCache, tableSort);

  const inProgressMessages = sortedMessages.filter(
    message => !message.isRepliedTo && !message.isCompleted,
  );

  const completedMessages = sortCompletedMessages(sortedMessages, tableSort);

  return {
    completedMessages,
    inProgressMessages,
    messages: sortedMessages,
  };
};
