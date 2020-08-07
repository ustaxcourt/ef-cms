import { state } from 'cerebral';

export const workQueueHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const selectedWorkItems = get(state.selectedWorkItems);
  const workQueueToDisplay = get(state.workQueueToDisplay);
  const { USER_ROLES } = applicationContext.getConstants();
  const isJudge = user.role === USER_ROLES.judge;
  const { qcUnreadCount } = get(state.notifications);
  const showInbox = workQueueToDisplay.box === 'inbox';
  const showInProgress = workQueueToDisplay.box === 'inProgress';
  const showOutbox = workQueueToDisplay.box === 'outbox';
  const showIndividualWorkQueue = workQueueToDisplay.queue === 'my';
  const sectionInboxCount = get(state.sectionInboxCount);
  const myUnreadCount = qcUnreadCount;
  const userIsChambers = user.role === USER_ROLES.chambers;
  const userIsPetitionsClerk = user.role === USER_ROLES.petitionsClerk;
  const userIsDocketClerk = user.role === USER_ROLES.docketClerk;
  const userIsOther = ![
    USER_ROLES.docketClerk,
    USER_ROLES.petitionsClerk,
  ].includes(user.role);
  const workQueueTitle = `${
    showIndividualWorkQueue ? 'My ' : userIsOther ? '' : 'Section '
  }Document QC`;
  const permissions = get(state.permissions);

  const outboxFiledByColumnLabel = userIsPetitionsClerk ? 'Processed' : 'Filed';

  const showStartPetitionButton = permissions.START_PAPER_CASE;

  return {
    currentBoxView: workQueueToDisplay.box,
    getQueuePath: ({ box, queue }) => {
      return `/document-qc/${queue}/${box}`;
    },
    hideCaseStatusColumn: userIsPetitionsClerk,
    hideFiledByColumn: !userIsDocketClerk,
    hideIconColumn: userIsOther,
    inboxCount: showIndividualWorkQueue ? myUnreadCount : sectionInboxCount,
    outboxFiledByColumnLabel,
    sentTitle: userIsDocketClerk ? 'Processed' : 'Served',
    showAssignedToColumn:
      !showIndividualWorkQueue && (showInbox || showInProgress) && !userIsOther,
    showCaseStatusColumn: isJudge || userIsChambers,
    showEditDocketEntry: permissions.DOCKET_ENTRY,
    showFromColumn: isJudge || userIsChambers,
    showInProgressTab: userIsDocketClerk || userIsPetitionsClerk,
    showInbox,
    showIndividualWorkQueue,
    showMyQueueToggle: userIsDocketClerk || userIsPetitionsClerk,
    showOutbox,
    showProcessedByColumn:
      (userIsDocketClerk && showOutbox) ||
      (userIsPetitionsClerk && showInProgress),
    showSectionSentTab: userIsDocketClerk || userIsPetitionsClerk,
    showSectionWorkQueue: workQueueToDisplay.queue === 'section',
    showSelectColumn: permissions.ASSIGN_WORK_ITEM,
    showSendToBar: selectedWorkItems.length > 0,
    showStartPetitionButton,
    workQueueTitle,
  };
};
