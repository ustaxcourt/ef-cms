import { state } from 'cerebral';

export const messagesHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();
  const userRole = user && user.role;
  const isCaseServicesSupervisor =
    userRole === USER_ROLES.caseServicesSupervisor;
  const messageBoxToDisplay = get(state.messageBoxToDisplay);
  const showIndividualMessages = messageBoxToDisplay.queue === 'my';
  const showSectionMessages =
    messageBoxToDisplay.queue === 'section' && !isCaseServicesSupervisor;

  const messagesInboxCount = get(state.messagesInboxCount);
  const messagesSectionCount = get(state.messagesSectionCount);
  const inboxCount = showIndividualMessages
    ? messagesInboxCount
    : messagesSectionCount;

  const messagesTitle = showIndividualMessages
    ? 'My Messages'
    : 'Section Messages';

  return {
    inboxCount,
    messagesTitle,
    showIndividualMessages,
    showSectionMessages,
  };
};
