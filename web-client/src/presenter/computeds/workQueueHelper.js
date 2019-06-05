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
  const showOutbox = workQueueToDisplay.box === 'outbox';
  const showIndividualWorkQueue = workQueueToDisplay.queue === 'my';
  const sectionInboxCount = get(state.sectionInboxCount);
  const myUnreadCount = workQueueIsInternal
    ? myInboxUnreadCount
    : qcUnreadCount;
  const workQueueType = workQueueIsInternal ? 'Messages' : 'Document QC';
  const isDisplayingQC = !workQueueIsInternal;
  const userIsPetitionsClerk = userRole === 'petitionsclerk';
  const userIsDocketClerk = userRole === 'docketclerk';

  return {
    assigneeColumnTitle: isDisplayingQC ? 'Assigned To' : 'To',
    currentBoxView: showInbox ? 'inbox' : 'outbox',
    getQueuePath: ({ box, queue }) => {
      return `/${
        workQueueIsInternal ? 'messages' : 'document-qc'
      }/${queue}/${box}`;
    },
    hideFiledByColumn: !(isDisplayingQC && userIsPetitionsClerk),
    hideFromColumn: isDisplayingQC,
    hideSectionColumn: isDisplayingQC,
    inboxCount: showIndividualWorkQueue ? myUnreadCount : sectionInboxCount,
    sentTitle: workQueueIsInternal
      ? 'Sent'
      : userIsDocketClerk
      ? 'Processed'
      : 'Served',
    showAssignedToColumn:
      (isDisplayingQC && !showIndividualWorkQueue && showInbox) ||
      !isDisplayingQC,
    showBatchedForIRSTab: userIsPetitionsClerk && workQueueIsInternal === false,
    showInbox,
    showIndividualWorkQueue,
    showMessageContent: !isDisplayingQC,
    showMyQueueToggle: userIsDocketClerk || userIsPetitionsClerk,
    showOutbox,
    showProcessedByColumn: isDisplayingQC && userIsDocketClerk && showOutbox,
    showRunBatchIRSProcessButton: userSection === 'petitions',
    showSectionSentTab:
      workQueueIsInternal || userIsDocketClerk || userIsPetitionsClerk,
    showSectionWorkQueue: workQueueToDisplay.queue === 'section',
    showSelectColumn:
      (isDisplayingQC && (userIsPetitionsClerk || userIsDocketClerk)) ||
      (workQueueIsInternal && !isDisplayingQC),
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
