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
  const workQueueType = workQueueIsInternal ? 'Messages' : 'Document QC';
  const isDisplayingQC = !workQueueIsInternal;

  return {
    assigneeColumnTitle: isDisplayingQC ? 'Assigned To' : 'To',
    currentBoxView: showInbox ? 'inbox' : 'outbox',
    hideFromColumn: isDisplayingQC,
    hideSectionColumn: isDisplayingQC,
    inboxCount: showIndividualWorkQueue ? myUnreadCount : sectionInboxCount,
    sentTitle: workQueueIsInternal
      ? 'Sent'
      : userRole === 'docketclerk'
      ? 'Processed'
      : 'Served',
    showBatchedForIRSTab:
      userRole === 'petitionsclerk' && workQueueIsInternal === false,
    showInbox,
    showIndividualWorkQueue,
    showMessageContent: !isDisplayingQC,
    showMyQueueToggle:
      userRole === 'docketclerk' || userRole === 'petitionsclerk',
    showOutbox: workQueueToDisplay.box === 'outbox',
    showRunBatchIRSProcessButton: userSection === 'petitions',
    showSectionSentTab:
      workQueueIsInternal ||
      userRole === 'docketclerk' ||
      userRole === 'petitionsclerk',
    showSectionWorkQueue: workQueueToDisplay.queue === 'section',
    showSendToBar: selectedWorkItems.length > 0,
    showStartCaseButton:
      !!userRoleMap.petitionsclerk || !!userRoleMap.docketclerk,
    workQueueIsInternal,
    workQueueTitle: `${
      showIndividualWorkQueue ? 'My' : 'Section'
    } ${workQueueType}`,
    workQueueType,
  };
};
