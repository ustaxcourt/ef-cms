import { mapValueHelper } from './mapValueHelper';
import { state } from 'cerebral';

export const workQueueHelper = get => {
  const selectedWorkItems = get(state.selectedWorkItems);
  const workQueueToDisplay = get(state.workQueueToDisplay);
  const userSection = get(state.user.section);
  const userRole = get(state.user.role);
  const userRoleMap = mapValueHelper(userRole);
  const { myInboxUnreadCount, qcUnreadCount } = get(state.notifications);
  const workQueueIsInternal = get(state.workQueueIsInternal);
  const showInbox = workQueueToDisplay.box === 'inbox';
  const showIndividualWorkQueue = workQueueToDisplay.queue === 'my';
  const sectionInboxCount = get(state.sectionInboxCount);
  const myUnreadCount = workQueueIsInternal
    ? myInboxUnreadCount
    : qcUnreadCount;

  return {
    currentBoxView: showInbox ? 'inbox' : 'outbox',
    inboxCount: showIndividualWorkQueue ? myUnreadCount : sectionInboxCount,
    sentTitle: workQueueIsInternal
      ? 'Sent'
      : userRole === 'docketclerk'
      ? 'Processed'
      : 'Served',
    showBatchedForIRSTab:
      userRole === 'docketclerk' ? false : workQueueIsInternal === false,
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
