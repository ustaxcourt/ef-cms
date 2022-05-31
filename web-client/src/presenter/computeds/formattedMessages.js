import { getFormattedMessages } from '../utilities/processFormattedMessages';
import { map, uniq } from 'lodash';
import { state } from 'cerebral';

export const formattedMessages = (get, applicationContext) => {
  const tableSort = get(state.tableSort);

  const { completedMessages, messages } = getFormattedMessages({
    applicationContext,
    cacheKey: get(state.messageCacheKey),
    messages: get(state.messages) || [],
    tableSort,
  });

  const { box, section } = get(state.messageBoxToDisplay);
  const { role } = get(state.user);

  const { USER_ROLES } = applicationContext.getConstants();

  if (box === 'outbox' && section === 'section' && role !== USER_ROLES.adc) {
    messages.reverse();
  }

  const {
    caseStatus: caseStatusFilter,
    completedBy: completedByFilter,
    fromSection: fromSectionFilter,
    fromUser: fromUserFilter,
    toSection: toSectionFilter,
    toUser: toUserFilter,
  } = get(state.screenMetadata);

  let filteredMessages = messages;
  let showFilters = false;
  let filteredCompletedMessages = completedMessages;

  if (role === USER_ROLES.adc) {
    showFilters = true;
    filteredMessages = messages
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

    filteredCompletedMessages = completedMessages.filter(message =>
      completedByFilter ? message.completedBy === completedByFilter : true,
    );
  }

  const caseStatuses = uniq(map(filteredMessages, 'caseStatus'));
  const toUsers = uniq(map(filteredMessages, 'to'));
  const fromUsers = uniq(map(filteredMessages, 'from'));
  const fromSections = uniq(map(filteredMessages, 'fromSection'));
  const toSections = uniq(map(filteredMessages, 'toSection'));

  const completedByUsers = uniq(map(filteredCompletedMessages, 'completedBy'));

  return {
    caseStatuses,
    completedByUsers,
    completedMessages: filteredCompletedMessages,
    fromSections,
    fromUsers,
    messages: filteredMessages,
    showFilters,
    showSortableHeaders: role === USER_ROLES.adc,
    toSections,
    toUsers,
  };
};
