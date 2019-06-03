import { mapValueHelper } from './mapValueHelper';
import { state } from 'cerebral';

export const workQueueHelper = get => {
  const selectedWorkItems = get(state.selectedWorkItems);
  const workQueueToDisplay = get(state.workQueueToDisplay);
  const userSection = get(state.user.section);
  const userRole = get(state.user.role);
  const userRoleMap = mapValueHelper(userRole);
  const unreadCount = get(state.notifications.unreadCount);
  const workQueueIsInternal = get(state.workQueueIsInternal);
  const showInbox = workQueueToDisplay.box === 'inbox';
  const showIndividualWorkQueue = workQueueToDisplay.queue === 'my';
  const sectionInboxCount = get(state.sectionInboxCount);

  return {
    currentBoxView: showInbox ? 'inbox' : 'outbox',
    inboxCount: showIndividualWorkQueue ? unreadCount : sectionInboxCount,
    showInbox,
    showIndividualWorkQueue,
    showOutbox: workQueueToDisplay.box === 'outbox',
    showRunBatchIRSProcessButton: userSection === 'petitions',
    showSectionWorkQueue: workQueueToDisplay.queue === 'section',
    showSendToBar: selectedWorkItems.length > 0,
    showStartCaseButton:
      !!userRoleMap.petitionsclerk || !!userRoleMap.docketclerk,
    workQueueTitle: `${showIndividualWorkQueue ? 'My' : 'Section'} ${
      workQueueIsInternal ? 'Messages' : 'Document QC'
    }`,
  };
};
