import { mapValueHelper } from './mapValueHelper';
import { state } from 'cerebral';

export const workQueueHelper = get => {
  const selectedWorkItems = get(state.selectedWorkItems);
  const workQueueToDisplay = get(state.workQueueToDisplay);
  const userSection = get(state.user.section);
  const userRole = get(state.user.role);
  const userRoleMap = mapValueHelper(userRole);
  const { myInboxUnreadCount, qcUnreadCount } = get(state.notifications);
  const { workQueueIsInternal } = workQueueToDisplay;
  const showInbox = workQueueToDisplay.box === 'inbox';
  const showInProgress = workQueueToDisplay.box === 'inProgress';
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
  const userIsOther = !['docketclerk', 'petitionsclerk'].includes(userRole);
  const workQueueTitle = `${
    showIndividualWorkQueue
      ? 'My'
      : userIsOther && !workQueueIsInternal
      ? 'Docket'
      : 'Section'
  } ${workQueueType}`;

  return {
    assigneeColumnTitle: isDisplayingQC ? 'Assigned To' : 'To',
    currentBoxView: workQueueToDisplay.box,
    getQueuePath: ({ box, queue }) => {
      return `/${
        workQueueIsInternal ? 'messages' : 'document-qc'
      }/${queue}/${box}`;
    },
    hideCaseStatusColumn: userIsPetitionsClerk && isDisplayingQC,
    hideFiledByColumn: !(isDisplayingQC && userIsDocketClerk),
    hideFromColumn: isDisplayingQC,
    hideIconColumn: !workQueueIsInternal && userIsOther,
    hideSectionColumn: isDisplayingQC,
    inboxCount: showIndividualWorkQueue ? myUnreadCount : sectionInboxCount,
    isDisplayingQC,
    linkToDocumentMessages: !isDisplayingQC,
    queueEmptyMessage: 'No items to display',
    sentTitle: workQueueIsInternal
      ? 'Sent'
      : userIsDocketClerk
      ? 'Processed'
      : 'Served',
    showAssignedToColumn:
      (isDisplayingQC &&
        !showIndividualWorkQueue &&
        (showInbox || showInProgress) &&
        !userIsOther) ||
      !isDisplayingQC,
    showBatchedForIRSTab: userIsPetitionsClerk && workQueueIsInternal === false,
    showInProgresssTab: isDisplayingQC && userIsDocketClerk,
    showInbox,
    showIndividualWorkQueue,
    showMessageContent: !isDisplayingQC,
    showMessagesSentFromColumn: !isDisplayingQC,
    showMyQueueToggle:
      workQueueIsInternal || userIsDocketClerk || userIsPetitionsClerk,
    showOutbox,
    showProcessedByColumn: isDisplayingQC && userIsDocketClerk && showOutbox,
    showReceivedColumn: isDisplayingQC,
    showRunBatchIRSProcessButton: userSection === 'petitions',
    showSectionSentTab:
      workQueueIsInternal || userIsDocketClerk || userIsPetitionsClerk,
    showSectionWorkQueue: workQueueToDisplay.queue === 'section',
    showSelectColumn:
      (isDisplayingQC && (userIsPetitionsClerk || userIsDocketClerk)) ||
      (workQueueIsInternal && !isDisplayingQC),
    showSendToBar: selectedWorkItems.length > 0,
    showSentColumn: !isDisplayingQC,
    showServedColumn: userIsPetitionsClerk && isDisplayingQC,
    showStartCaseButton:
      (!!userRoleMap.petitionsclerk || !!userRoleMap.docketclerk) &&
      isDisplayingQC,
    workQueueIsInternal,
    workQueueTitle,
    workQueueType,
  };
};
