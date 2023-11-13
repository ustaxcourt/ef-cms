import { capitalize } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const messagesHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
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

  const selectedSection = messageBoxToDisplay.section;
  const sectionTitle = selectedSection
    ? `${capitalize(selectedSection)} Section Messages`
    : 'Section Messages';

  let messagesTitle = showIndividualMessages ? 'My Messages' : sectionTitle;

  const showSwitchToSectionMessagesButton =
    showIndividualMessages && !isCaseServicesSupervisor;
  const showSwitchToMyMessagesButton =
    showSectionMessages && !isCaseServicesSupervisor;

  const messagesTabNavigationPath = ({ box, queue, section }) =>
    section
      ? `/messages/${queue}/${box}/selectedSection?section=${section}`
      : `/messages/${queue}/${box}`;

  if (isCaseServicesSupervisor) {
    showSectionMessages = !!selectedSection;
    showIndividualMessages = !selectedSection;
  }

  return {
    inboxCount,
    messagesTabNavigationPath,
    messagesTitle,
    showIndividualMessages,
    showSectionMessages,
    showSwitchToMyMessagesButton,
    showSwitchToSectionMessagesButton,
  };
};
