import { formatDateIfToday } from '../computeds/formattedWorkQueue';
import { getConstants } from '../../getConstants';
import { map, uniq } from 'lodash';

const { CASE_SERVICES_SUPERVISOR_SECTION, DESCENDING } = getConstants();

type TableSort = { sortField: string; sortOrder?: string };

export const SUPPORTED_SORT_FIELDS = [
  'createdAt',
  'completedAt',
  'completedBy',
  'completedBySection',
  'completedMessage',
  'subject',
  'caseTitle',
  'caseStatus',
  'from',
  'to',
  'toSection',
  'fromSectionFormatted',
];

export const sortFormattedMessages = (
  formattedCaseMessages,
  tableSort: null | TableSort = null,
) => {
  const sortedFormattedMessages = formattedCaseMessages.sort(
    (messageA, messageB) => {
      let sortNumber = 0;

      if (!tableSort) {
        sortNumber = messageA.createdAt.localeCompare(messageB.createdAt);
      } else if (SUPPORTED_SORT_FIELDS.includes(tableSort.sortField)) {
        const messageASortField: string = messageA[tableSort.sortField] || '';
        const messageBSortField: string = messageB[tableSort.sortField] || '';

        sortNumber = messageASortField.localeCompare(messageBSortField);
      } else if (tableSort.sortField === 'docketNumber') {
        const [messageADocketNumberIndex, messageADocketNumberYear] =
          messageA.docketNumber.split('-');
        const [messageBDocketNumberIndex, messageBDocketNumberYear] =
          messageB.docketNumber.split('-');

        if (messageADocketNumberYear !== messageBDocketNumberYear) {
          // compare years if they aren't the same;
          // compare as strings, because they *might* have suffix
          sortNumber = messageADocketNumberYear.localeCompare(
            messageBDocketNumberYear,
          );
        } else {
          // compare index if years are the same, compare as integers
          sortNumber = +messageADocketNumberIndex - +messageBDocketNumberIndex;
        }
      }
      return sortNumber;
    },
  );

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
  // this cache is cleared by the resetCacheKeyAction

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
