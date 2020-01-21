import {
  DOCKET_SECTION,
  IRS_BATCH_SYSTEM_SECTION,
  PETITIONS_SECTION,
} from '../../../../shared/src/business/entities/WorkQueue';
import { capitalize, cloneDeep, orderBy } from 'lodash';
import { state } from 'cerebral';

const isDateToday = (date, applicationContext) => {
  const now = applicationContext.getUtilities().formatNow('MMDDYY');
  const then = applicationContext
    .getUtilities()
    .formatDateString(date, 'MMDDYY');
  return now === then;
};

const formatDateIfToday = (date, applicationContext) => {
  const now = applicationContext.getUtilities().formatNow('MMDDYY');
  const then = applicationContext
    .getUtilities()
    .formatDateString(date, 'MMDDYY');
  const yesterday = applicationContext.getUtilities().formatDateString(
    applicationContext
      .getUtilities()
      .prepareDateFromString()
      .add(-1, 'days')
      .toDate(),
    'MMDDYY',
  );

  let formattedDate;
  if (now == then) {
    formattedDate = applicationContext
      .getUtilities()
      .formatDateString(date, 'TIME_TZ');
  } else if (then === yesterday) {
    formattedDate = 'Yesterday';
  } else {
    formattedDate = then;
  }
  return formattedDate;
};

export const formatWorkItem = ({
  applicationContext,
  workItem = {},
  selectedWorkItems = [],
  workQueueIsInternal,
}) => {
  const {
    COURT_ISSUED_EVENT_CODES,
    STATUS_TYPES,
    USER_ROLES,
  } = applicationContext.getConstants();

  const courtIssuedDocumentTypes = COURT_ISSUED_EVENT_CODES.map(
    courtIssuedDoc => courtIssuedDoc.documentType,
  );

  const result = cloneDeep(workItem);

  result.createdAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.createdAt, 'MMDDYY');

  result.messages = orderBy(result.messages, 'createdAt', 'desc');
  result.messages.forEach(message => {
    message.createdAtFormatted = formatDateIfToday(
      message.createdAt,
      applicationContext,
    );
    message.to = message.to || 'Unassigned';
    message.createdAtTimeFormattedTZ = applicationContext
      .getUtilities()
      .formatDateString(message.createdAt, 'DATE_TIME_TZ');
  });
  result.sentBySection = capitalize(result.sentBySection);
  result.completedAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.completedAt, 'DATE_TIME');
  result.completedAtFormattedTZ = applicationContext
    .getUtilities()
    .formatDateString(result.completedAt, 'DATE_TIME_TZ');
  result.assigneeName = result.assigneeName || 'Unassigned';

  result.showUnreadIndicators = !result.isRead;
  result.showUnreadStatusIcon = !result.isRead;

  result.showComplete = !result.isInitializeCase;
  result.showSendTo = !result.isInitializeCase;

  if (result.assigneeName === 'Unassigned') {
    result.showUnassignedIcon = true;
  }

  switch (result.caseStatus.trim()) {
    case STATUS_TYPES.batchedForIRS:
      result.showBatchedStatusIcon = true;
      result.showUnreadStatusIcon = false;
      result.showUnassignedIcon = false;
      break;
    case STATUS_TYPES.recalled:
      result.showRecalledStatusIcon = true;
      result.showUnreadStatusIcon = false;
      break;
    case STATUS_TYPES.generalDocket:
    case STATUS_TYPES.new:
    default:
      result.showBatchedStatusIcon = false;
      result.showRecalledStatusIcon = false;
  }

  if (applicationContext.getCurrentUser().role !== USER_ROLES.petitionsClerk) {
    result.showRecalledStatusIcon = false;
    result.showBatchedStatusIcon = false;
  }

  result.docketNumberWithSuffix = `${
    result.docketNumber
  }${result.docketNumberSuffix || ''}`;

  result.selected = !!selectedWorkItems.find(
    selectedWorkItem => selectedWorkItem.workItemId == result.workItemId,
  );

  result.currentMessage = result.messages[0];

  result.receivedAt = workQueueIsInternal
    ? result.currentMessage.createdAt
    : isDateToday(result.document.receivedAt, applicationContext)
    ? result.document.createdAt
    : result.document.receivedAt;
  result.received = formatDateIfToday(result.receivedAt, applicationContext);

  result.sentDateFormatted = formatDateIfToday(
    result.currentMessage.createdAt,
    applicationContext,
  );
  result.historyMessages = result.messages.slice(1);

  if (
    result.messages.find(
      message => message.message == 'Petition batched for IRS',
    )
  ) {
    result.batchedAt = result.messages.find(
      message => message.message == 'Petition batched for IRS',
    ).createdAtTimeFormattedTZ;
  }

  result.isCourtIssuedDocument = !!courtIssuedDocumentTypes.includes(
    result.document.documentType,
  );

  return result;
};

export const getWorkItemDocumentLink = ({
  applicationContext,
  permissions,
  workItem,
  workQueueToDisplay = {},
}) => {
  const { box, queue, workQueueIsInternal } = workQueueToDisplay;
  const result = cloneDeep(workItem);

  const formattedDocument = applicationContext
    .getUtilities()
    .formatDocument(applicationContext, result.document);

  const isInProgress = formattedDocument && formattedDocument.isInProgress;

  const qcWorkItemsUntouched =
    !isInProgress &&
    formattedDocument &&
    !result.isRead &&
    !result.completedAt &&
    !result.isCourtIssuedDocument;

  const showDocumentEditLink =
    formattedDocument &&
    permissions.UPDATE_CASE &&
    (!formattedDocument.isInProgress ||
      (permissions.DOCKET_ENTRY && formattedDocument.isInProgress));

  let editLink; //defaults to doc detail
  if (
    showDocumentEditLink &&
    permissions.DOCKET_ENTRY &&
    formattedDocument &&
    !workQueueIsInternal
  ) {
    if (
      formattedDocument.isCourtIssuedDocument &&
      !formattedDocument.servedAt
    ) {
      editLink = '/edit-court-issued';
    } else if (isInProgress) {
      editLink = '/complete';
    } else if (
      !result.isCourtIssuedDocument &&
      !formattedDocument.isPetition &&
      qcWorkItemsUntouched
    ) {
      editLink = '/edit';
    }
  }
  if (!editLink) {
    const { USER_ROLES } = applicationContext.getConstants();
    const user = applicationContext.getCurrentUser();
    const messageId = result.messages[0] && result.messages[0].messageId;

    const workItemIdToMarkAsRead = !result.isRead ? result.workItemId : null;

    const markReadPath =
      workItemIdToMarkAsRead && box === 'inbox' && queue === 'my'
        ? `/mark/${workItemIdToMarkAsRead}`
        : '';

    if (
      messageId &&
      (workQueueIsInternal ||
        permissions.DOCKET_ENTRY ||
        (!workQueueIsInternal &&
          user.role === USER_ROLES.petitionsClerk &&
          box === 'inbox'))
    ) {
      editLink = `/messages/${messageId}${markReadPath}`;
    } else {
      editLink = `${markReadPath}`;
    }
  }

  return editLink;
};

export const filterWorkItems = ({
  applicationContext,
  user,
  workQueueToDisplay,
}) => {
  const { STATUS_TYPES, USER_ROLES } = applicationContext.getConstants();

  const { box, queue, workQueueIsInternal } = workQueueToDisplay;
  let docQCUserSection = user.section;

  if (user.section !== PETITIONS_SECTION) {
    docQCUserSection = DOCKET_SECTION;
  }

  const filters = {
    documentQc: {
      my: {
        batched: item => {
          return (
            !item.completedAt &&
            item.isQC &&
            item.sentByUserId === user.userId &&
            item.section === IRS_BATCH_SYSTEM_SECTION &&
            item.caseStatus === STATUS_TYPES.batchedForIRS
          );
        },
        inProgress: item => {
          return (
            item.assigneeId === user.userId &&
            !item.completedAt &&
            item.isQC &&
            item.section === user.section &&
            (item.document.isFileAttached === false || item.inProgress)
          );
        },
        inbox: item => {
          return (
            item.assigneeId === user.userId &&
            !item.completedAt &&
            item.isQC &&
            item.section === user.section &&
            item.document.isFileAttached !== false &&
            !item.inProgress
          );
        },
        outbox: item => {
          return (
            item.isQC &&
            (user.role === USER_ROLES.petitionsClerk
              ? item.section === IRS_BATCH_SYSTEM_SECTION
              : true) &&
            item.completedByUserId &&
            item.completedByUserId === user.userId &&
            !!item.completedAt
          );
        },
      },
      section: {
        batched: item => {
          return (
            !item.completedAt &&
            item.isQC &&
            item.section === IRS_BATCH_SYSTEM_SECTION &&
            item.caseStatus === STATUS_TYPES.batchedForIRS
          );
        },
        inProgress: item => {
          return (
            !item.completedAt &&
            item.isQC &&
            item.section === user.section &&
            (item.document.isFileAttached === false || item.inProgress)
          );
        },
        inbox: item => {
          return (
            !item.completedAt &&
            item.isQC &&
            item.section === docQCUserSection &&
            item.document.isFileAttached !== false &&
            !item.inProgress
          );
        },
        outbox: item => {
          return (
            !!item.completedAt &&
            item.isQC &&
            (user.role === USER_ROLES.petitionsClerk
              ? item.section === IRS_BATCH_SYSTEM_SECTION
              : true)
          );
        },
      },
    },
    messages: {
      my: {
        inbox: item => {
          return (
            !item.completedAt &&
            !item.isQC &&
            item.section === user.section &&
            item.assigneeId === user.userId
          );
        },
        outbox: item => {
          return (
            !item.completedAt &&
            !item.isQC &&
            item.sentByUserId &&
            item.sentByUserId === user.userId
          );
        },
      },
      section: {
        inbox: item => {
          return (
            !item.completedAt && !item.isQC && item.section === user.section
          );
        },
        outbox: item => {
          return (
            !item.completedAt &&
            !item.isQC &&
            item.sentBySection === user.section
          );
        },
      },
    },
  };

  const view = workQueueIsInternal ? 'messages' : 'documentQc';
  const composedFilter = filters[view][queue][box];
  return composedFilter;
};

export const formattedWorkQueue = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const workItems = get(state.workQueue);
  const workQueueToDisplay = get(state.workQueueToDisplay);
  const permissions = get(state.permissions);
  const { workQueueIsInternal } = workQueueToDisplay;
  const selectedWorkItems = get(state.selectedWorkItems);
  const { USER_ROLES } = applicationContext.getConstants();

  let workQueue = workItems
    .filter(
      filterWorkItems({
        applicationContext,
        user,
        workQueueToDisplay,
      }),
    )
    .map(item => {
      const result = formatWorkItem({
        applicationContext,
        selectedWorkItems,
        workItem: item,
        workQueueIsInternal,
      });
      const editLink = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: item,
        workQueueToDisplay,
      });
      return { ...result, editLink };
    });

  const sortFields = {
    documentQc: {
      my: {
        batched: 'batchedAt',
        inProgress: 'receivedAt',
        inbox: 'receivedAt',
        outbox:
          user.role === USER_ROLES.petitionsClerk
            ? 'completedAt'
            : 'receivedAt',
      },
      section: {
        batched: 'batchedAt',
        inProgress: 'receivedAt',
        inbox: 'receivedAt',
        outbox:
          user.role === USER_ROLES.petitionsClerk
            ? 'completedAt'
            : 'receivedAt',
      },
    },
    messages: {
      my: {
        inbox: 'receivedAt',
        outbox: 'receivedAt',
      },
      section: {
        inbox: 'receivedAt',
        outbox: 'receivedAt',
      },
    },
  };

  const sortDirections = {
    documentQc: {
      my: {
        batched: 'asc',
        inProgress: 'asc',
        inbox: 'asc',
        outbox: 'desc',
      },
      section: {
        batched: 'asc',
        inProgress: 'asc',
        inbox: 'asc',
        outbox: 'desc',
      },
    },
    messages: {
      my: {
        inbox: 'asc',
        outbox: 'desc',
      },
      section: {
        inbox: 'asc',
        outbox: 'desc',
      },
    },
  };

  const sortField =
    sortFields[workQueueIsInternal ? 'messages' : 'documentQc'][
      workQueueToDisplay.queue
    ][workQueueToDisplay.box];

  const sortDirection =
    sortDirections[workQueueIsInternal ? 'messages' : 'documentQc'][
      workQueueToDisplay.queue
    ][workQueueToDisplay.box];

  workQueue = orderBy(workQueue, [sortField, 'docketNumber'], sortDirection);

  return workQueue;
};
