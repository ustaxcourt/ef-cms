import { state } from 'cerebral';

export const messagesHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();
  const userRole = user && user.role;
  const isCaseServicesSupervisor =
    userRole === USER_ROLES.caseServicesSupervisor;
  const messageBoxToDisplay = get(state.messageBoxToDisplay);
  let showIndividualMessages = messageBoxToDisplay.queue === 'my';
  let showSectionMessages = messageBoxToDisplay.queue === 'section';

  const messagesInboxCount = get(state.messagesInboxCount);
  const messagesSectionCount = get(state.messagesSectionCount);
  const inboxCount = showIndividualMessages
    ? messagesInboxCount
    : messagesSectionCount;

  let messageBoxSection = messageBoxToDisplay.section;
  const sectionTitle = messageBoxSection
    ? `${
        messageBoxSection.charAt(0).toUpperCase() + messageBoxSection.slice(1)
      } Section Messages`
    : 'Section Messages';

  let messagesTitle = showIndividualMessages ? 'My Messages' : sectionTitle;

  const showSwitchToSectionMessagesButton =
    showIndividualMessages && !isCaseServicesSupervisor;
  const showSwitchToMyMessagesButton =
    showSectionMessages && !isCaseServicesSupervisor;
  if (isCaseServicesSupervisor) {
    if (messageBoxToDisplay.section) {
      showSectionMessages = true;
      showIndividualMessages = false;
    } else {
      showSectionMessages = false;
      showIndividualMessages = true;
    }
  }
  return {
    inboxCount,
    messagesTitle,
    showIndividualMessages,
    showSectionMessages,
    showSwitchToMyMessagesButton,
    showSwitchToSectionMessagesButton,
  };
};
