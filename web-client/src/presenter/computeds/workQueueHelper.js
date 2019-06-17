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
  const showBatched = workQueueToDisplay.box === 'batched';
  const showIndividualWorkQueue = workQueueToDisplay.queue === 'my';
  const sectionInboxCount = get(state.sectionInboxCount);
  const myUnreadCount = workQueueIsInternal
    ? myInboxUnreadCount
    : qcUnreadCount;
  const workQueueType = workQueueIsInternal ? 'Messages' : 'Document QC';
  const isDisplayingQC = !workQueueIsInternal;
  const userIsPetitionsClerk = userRole === 'petitionsclerk';
  const userIsDocketClerk = userRole === 'docketclerk';
  const userIsOther =
    ['docketclerk', 'petitionsclerk'].indexOf(userRole) === -1;
  const workQueueTitle = `${
    showIndividualWorkQueue
      ? 'My'
      : ['docketclerk', 'petitionsclerk'].indexOf(userRole) === -1 &&
        !workQueueIsInternal
      ? 'Docket'
      : 'Section'
  } ${workQueueType}`;

  return {
    assigneeColumnTitle: isDisplayingQC ? 'Assigned To' : 'To',
    currentBoxView: showInbox ? 'inbox' : showBatched ? 'batched' : 'outbox',
    getQueuePath: ({ box, queue }) => {
      return `/${
        workQueueIsInternal ? 'messages' : 'document-qc'
      }/${queue}/${box}`;
    },
    hideCaseStatusColumn: userIsPetitionsClerk && isDisplayingQC,
    hideFiledByColumn: !(isDisplayingQC && userIsPetitionsClerk),
    hideFromColumn: isDisplayingQC,
    hideIconColumn:
      !workQueueIsInternal &&
      ['docketclerk', 'petitionsclerk'].indexOf(userRole) === -1,
    hideSectionColumn: isDisplayingQC,
    inboxCount: showIndividualWorkQueue ? myUnreadCount : sectionInboxCount,
    linkToDocumentMessages: !isDisplayingQC,
    sentTitle: workQueueIsInternal
      ? 'Sent'
      : userIsDocketClerk
      ? 'Processed'
      : 'Served',
    showAssignedToColumn:
      (isDisplayingQC &&
        !showIndividualWorkQueue &&
        showInbox &&
        !userIsOther) ||
      !isDisplayingQC,
    showBatchedForIRSTab: userIsPetitionsClerk && workQueueIsInternal === false,
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
      !!userRoleMap.petitionsclerk || !!userRoleMap.docketclerk,
    workQueueIsInternal,
    workQueueTitle,
    workQueueType,
  };
};
