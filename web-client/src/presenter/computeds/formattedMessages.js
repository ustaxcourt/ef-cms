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
  const completedByUsers = uniq(map(completedMessages, 'completedBy'));

  const currentMessageBox = get(state.messageBoxToDisplay.box);

  if (currentMessageBox === 'outbox') {
    messages.reverse();
  }

  const {
    caseStatus: caseStatusFilter,
    completedBy: completedByFilter,
    fromUser: fromUserFilter,
    section: sectionFilter,
    toUser: toUserFilter,
  } = get(state.screenMetadata);

  const { USER_ROLES } = applicationContext.getConstants();
  const { role } = get(state.user);

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
        sectionFilter ? message.fromSection === sectionFilter : true,
      )
      .filter(message => (toUserFilter ? message.to === toUserFilter : true));

    filteredCompletedMessages = completedMessages
      .filter(message =>
        caseStatusFilter ? message.caseStatus === caseStatusFilter : true,
      )
      .filter(message =>
        completedByFilter ? message.completedBy === completedByFilter : true,
      );
  }

  return {
    caseStatuses,
    completedByUsers,
    completedMessages: filteredCompletedMessages,
    fromSections,
    fromUsers,
    messages: filteredMessages,
    showFilters,
    toUsers,
  };
};
