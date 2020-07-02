import {
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '../../../../shared/src/business/entities/EntityConstants';
import { capitalize, cloneDeep, orderBy } from 'lodash';
import { filterQcItemsByAssociatedJudge } from '../utilities/filterQcItemsByAssociatedJudge';
import { state } from 'cerebral';

const isDateToday = (date, applicationContext) => {
  const now = applicationContext.getUtilities().formatNow('MMDDYY');
  const then = applicationContext
    .getUtilities()
    .formatDateString(date, 'MMDDYY');
  return now === then;
};

export const formatDateIfToday = (date, applicationContext) => {
  const now = applicationContext.getUtilities().formatNow('MMDDYY');
  const then = applicationContext
    .getUtilities()
    .formatDateString(date, 'MMDDYY');
  const yesterday = applicationContext
    .getUtilities()
    .formatDateString(
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
    ORDER_TYPES_MAP,
  } = applicationContext.getConstants();

  const courtIssuedDocumentTypes = COURT_ISSUED_EVENT_CODES.map(
    courtIssuedDoc => courtIssuedDoc.documentType,
  );
  const orderDocumentTypes = ORDER_TYPES_MAP.map(
    orderDoc => orderDoc.documentType,
  );

  const result = cloneDeep(workItem);

  result.createdAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.createdAt, 'MMDDYY');

  result.highPriority = !!result.highPriority;
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

  if (result.highPriority) {
    result.showHighPriorityIcon = true;
  }

  result.showUnreadIndicators = !result.isRead;
  result.showUnreadStatusIcon = !result.isRead && !result.showHighPriorityIcon;

  result.showComplete = !result.isInitializeCase;
  result.showSendTo = !result.isInitializeCase;

  if (result.assigneeName === 'Unassigned' && !result.showHighPriorityIcon) {
    result.showUnassignedIcon = true;
  }

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

  result.isCourtIssuedDocument = !!courtIssuedDocumentTypes.includes(
    result.document.documentType,
  );
  result.isOrder = !!orderDocumentTypes.includes(result.document.documentType);

  let descriptionDisplay = result.document.documentType;

  if (result.document.documentTitle) {
    descriptionDisplay = result.document.documentTitle;
    if (result.document.additionalInfo) {
      descriptionDisplay += ` ${result.document.additionalInfo}`;
    }
  }

  result.document.descriptionDisplay = descriptionDisplay;

  return result;
};

const getDocketEntryEditLink = ({
  formattedDocument,
  isInProgress,
  qcWorkItemsUntouched,
  result,
}) => {
  let editLink;
  if (formattedDocument.isCourtIssuedDocument && !formattedDocument.servedAt) {
    editLink = '/edit-court-issued';
  } else if (isInProgress) {
    editLink = '/complete';
  } else if (
    !result.isCourtIssuedDocument &&
    !result.isOrder &&
    !formattedDocument.isPetition &&
    qcWorkItemsUntouched
  ) {
    editLink = '/edit';
  }
  return editLink;
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

  const documentDetailLink = `/case-detail/${workItem.docketNumber}/documents/${workItem.document.documentId}`;
  let editLink = documentDetailLink;
  if (showDocumentEditLink && !workQueueIsInternal) {
    if (permissions.DOCKET_ENTRY) {
      const editLinkExtension = getDocketEntryEditLink({
        formattedDocument,
        isInProgress,
        qcWorkItemsUntouched,
        result,
      });
      if (editLinkExtension) {
        editLink += editLinkExtension;
      } else {
        editLink = `/case-detail/${workItem.docketNumber}/document-view?documentId=${workItem.document.documentId}`;
      }
    } else if (formattedDocument.isPetition && !formattedDocument.servedAt) {
      if (result.caseIsInProgress) {
        editLink += '/review';
      } else {
        editLink = `/case-detail/${workItem.docketNumber}/petition-qc`;
      }
    }
  }
  if (editLink === documentDetailLink) {
    const messageId = result.messages[0] && result.messages[0].messageId;

    const workItemIdToMarkAsRead = !result.isRead ? result.workItemId : null;

    const markReadPath =
      workItemIdToMarkAsRead && box === 'inbox' && queue === 'my'
        ? `/mark/${workItemIdToMarkAsRead}`
        : '';

    if (messageId && (workQueueIsInternal || permissions.DOCKET_ENTRY)) {
      editLink = `/messages/${messageId}${markReadPath}`;
    } else if (markReadPath) {
      editLink = `${markReadPath}`;
    }
  }

  return editLink;
};

export const filterWorkItems = ({
  applicationContext,
  judgeUser,
  user,
  workQueueToDisplay,
}) => {
  const { STATUS_TYPES, USER_ROLES } = applicationContext.getConstants();

  const { box, queue, workQueueIsInternal } = workQueueToDisplay;
  let docQCUserSection = user.section;

  if (user.section !== PETITIONS_SECTION) {
    docQCUserSection = DOCKET_SECTION;
  }

  let additionalFilters = filterQcItemsByAssociatedJudge({
    applicationContext,
    judgeUser,
  });

  const filters = {
    documentQc: {
      my: {
        inProgress: item => {
          return (
            // DocketClerks
            (item.assigneeId === user.userId &&
              user.role === USER_ROLES.docketClerk &&
              !item.completedAt &&
              item.isQC &&
              item.section === user.section &&
              (item.document.isFileAttached === false || item.inProgress)) ||
            // PetitionsClerks
            (item.assigneeId === user.userId &&
              user.role === USER_ROLES.petitionsClerk &&
              item.caseStatus === STATUS_TYPES.new &&
              item.caseIsInProgress === true)
          );
        },
        inbox: item => {
          return (
            item.assigneeId === user.userId &&
            !item.completedAt &&
            item.isQC &&
            item.section === user.section &&
            item.document.isFileAttached !== false &&
            !item.inProgress &&
            item.caseIsInProgress !== true
          );
        },
        outbox: item => {
          return (
            item.isQC &&
            (user.role === USER_ROLES.petitionsClerk ? !!item.section : true) &&
            item.completedByUserId &&
            item.completedByUserId === user.userId &&
            !!item.completedAt
          );
        },
      },
      section: {
        inProgress: item => {
          return (
            // DocketClerks
            (!item.completedAt &&
              user.role === USER_ROLES.docketClerk &&
              item.isQC &&
              item.section === user.section &&
              (item.document.isFileAttached === false || item.inProgress)) ||
            // PetitionsClerks
            (user.role === USER_ROLES.petitionsClerk &&
              item.caseStatus === STATUS_TYPES.new &&
              item.caseIsInProgress === true)
          );
        },
        inbox: item => {
          return (
            !item.completedAt &&
            item.isQC &&
            item.section === docQCUserSection &&
            item.document.isFileAttached !== false &&
            !item.inProgress &&
            additionalFilters(item) &&
            item.caseIsInProgress !== true
          );
        },
        outbox: item => {
          return (
            !!item.completedAt &&
            item.isQC &&
            (user.role === USER_ROLES.petitionsClerk ? !!item.section : true)
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

  const judgeUser = get(state.judgeUser);

  let workQueue = workItems
    .filter(
      filterWorkItems({
        applicationContext,
        judgeUser,
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
        inProgress: 'receivedAt',
        inbox: 'receivedAt',
        outbox:
          user.role === USER_ROLES.petitionsClerk
            ? 'completedAt'
            : 'receivedAt',
      },
      section: {
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
        inProgress: 'asc',
        inbox: 'asc',
        outbox: 'desc',
      },
      section: {
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

  let highPriorityField = [];
  let highPriorityDirection = [];
  if (!workQueueIsInternal && workQueueToDisplay.box == 'inbox') {
    highPriorityField = ['highPriority', 'trialDate'];
    highPriorityDirection = ['desc', 'asc'];
  }

  workQueue = orderBy(
    workQueue,
    [...highPriorityField, sortField, 'docketNumber'],
    [...highPriorityDirection, sortDirection, 'asc'],
  );

  return workQueue;
};
