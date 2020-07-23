import { state } from 'cerebral';

export const workQueueHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const selectedWorkItems = get(state.selectedWorkItems);
  const workQueueToDisplay = get(state.workQueueToDisplay);
  const { USER_ROLES } = applicationContext.getConstants();
  const isJudge = user.role === USER_ROLES.judge;
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
  const userIsChambers = user.role === USER_ROLES.chambers;
  const userIsPetitionsClerk = user.role === USER_ROLES.petitionsClerk;
  const userIsDocketClerk = user.role === USER_ROLES.docketClerk;
  const userIsOther = ![
    USER_ROLES.docketClerk,
    USER_ROLES.petitionsClerk,
  ].includes(user.role);
  const workQueueTitle = `${
    showIndividualWorkQueue
      ? 'My '
      : userIsOther && !workQueueIsInternal
      ? ''
      : 'Section '
  }${workQueueType}`;
  const permissions = get(state.permissions);

  const inboxFiledColumnLabel = workQueueIsInternal ? 'Received' : 'Filed';
  const outboxFiledByColumnLabel = userIsPetitionsClerk ? 'Processed' : 'Filed';

  const showStartPetitionButton =
    permissions.START_PAPER_CASE && isDisplayingQC;

  return {
    assigneeColumnTitle: isDisplayingQC ? 'Assigned to' : 'To',
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
    inboxFiledColumnLabel,
    isDisplayingQC,
    linkToDocumentMessages: !isDisplayingQC,
    outboxFiledByColumnLabel,
    queueEmptyMessage: workQueueIsInternal
      ? 'There are no messages.'
      : 'There are no documents.',
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
    showCaseStatusColumn: isJudge || userIsChambers,
    showEditDocketEntry: permissions.DOCKET_ENTRY,
    showFromColumn: isJudge || userIsChambers,
    showInProgressTab:
      isDisplayingQC && (userIsDocketClerk || userIsPetitionsClerk),
    showInbox,
    showIndividualWorkQueue,
    showMessageContent: !isDisplayingQC,
    showMessagesSentFromColumn: !isDisplayingQC,
    showMyQueueToggle:
      workQueueIsInternal || userIsDocketClerk || userIsPetitionsClerk,
    showOutbox,
    showProcessedByColumn:
      (isDisplayingQC && userIsDocketClerk && showOutbox) ||
      (userIsPetitionsClerk && showInProgress),
    showReceivedColumn: isDisplayingQC,
    showSectionSentTab:
      workQueueIsInternal || userIsDocketClerk || userIsPetitionsClerk,
    showSectionWorkQueue: workQueueToDisplay.queue === 'section',
    showSelectColumn: isDisplayingQC && permissions.ASSIGN_WORK_ITEM,
    showSendToBar: selectedWorkItems.length > 0,
    showSentColumn: !isDisplayingQC,
    showServedColumn: userIsPetitionsClerk && isDisplayingQC,
    showStartPetitionButton,
    workQueueIsInternal,
    workQueueTitle,
    workQueueType,
  };
};
