import { formatDateIfToday } from '../computeds/formattedWorkQueue';
import { getConstants } from '../../getConstants';
import { map, uniq } from 'lodash';

const { CASE_SERVICES_SUPERVISOR_SECTION, DESCENDING } = getConstants();

type TableSort = { sortField: string; sortOrder?: string };

export const sortFormattedMessages = (
  formattedCaseMessages,
  tableSort: null | TableSort = null,
) => {
  const sortedFormattedMessages = formattedCaseMessages.sort((a, b) => {
    let sortNumber = 0;

    if (!tableSort) {
      sortNumber = a.createdAt.localeCompare(b.createdAt);
    } else if (
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

export const sortCompletedMessages = (
  sortedMessages,
  tableSort: null | TableSort = null,
) => {
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
  tableSort = null,
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
      const {
        consolidatedIconTooltipText,
        inConsolidatedGroup,
        isLeadCase,
        shouldIndent,
      } = applicationContext
        .getUtilities()
        .setConsolidationFlagsForDisplay(message);

      const messageFromCaseServices =
        message.fromSection === CASE_SERVICES_SUPERVISOR_SECTION;

      message.fromSectionFormatted = messageFromCaseServices
        ? 'Case Services'
        : message.fromSection;

      return {
        ...message,
        completedAtFormatted: formatDateIfToday(
          message.completedAt,
          applicationContext,
          now,
          yesterday,
        ),
        consolidatedIconTooltipText,
        createdAtFormatted: formatDateIfToday(
          message.createdAt,
          applicationContext,
          now,
          yesterday,
        ),
        inConsolidatedGroup,
        isLeadCase,
        messageDetailLink: `/messages/${message.docketNumber}/message-detail/${message.parentMessageId}`,
        shouldIndent,
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

export const applyFiltersToMessages = ({ messages, screenMetadata }) => {
  const {
    caseStatus: caseStatusFilter,
    fromSection: fromSectionFilter,
    fromUser: fromUserFilter,
    toSection: toSectionFilter,
    toUser: toUserFilter,
  } = screenMetadata;

  const filteredMessages = messages
    .filter(message =>
      caseStatusFilter ? message.caseStatus === caseStatusFilter : true,
    )
    .filter(message =>
      fromUserFilter ? message.from === fromUserFilter : true,
    )
    .filter(message =>
      toSectionFilter ? message.toSection === toSectionFilter : true,
    )
    .filter(message =>
      fromSectionFilter ? message.fromSection === fromSectionFilter : true,
    )
    .filter(message => (toUserFilter ? message.to === toUserFilter : true));

  const caseStatuses = uniq(map(filteredMessages, 'caseStatus')).sort();
  const toUsers = uniq(map(filteredMessages, 'to')).sort();
  const fromUsers = uniq(map(filteredMessages, 'from')).sort();
  const fromSections = uniq(map(filteredMessages, 'fromSection')).sort();
  const toSections = uniq(map(filteredMessages, 'toSection')).sort();

  return {
    filterValues: {
      caseStatuses,
      fromSections,
      fromUsers,
      toSections,
      toUsers,
    },
    filteredMessages,
  };
};

export const applyFiltersToCompletedMessages = ({
  completedMessages,
  screenMetadata,
}) => {
  const { completedBy: completedByFilter } = screenMetadata;

  const filteredCompletedMessages = completedMessages.filter(message =>
    completedByFilter ? message.completedBy === completedByFilter : true,
  );

  const completedByUsers = uniq(
    map(filteredCompletedMessages, 'completedBy'),
  ).sort();

  return {
    filterValues: {
      completedByUsers,
    },
    filteredCompletedMessages,
  };
};
