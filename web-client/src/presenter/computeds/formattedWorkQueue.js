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
}) => {
  const {
    COURT_ISSUED_DOCUMENT_TYPES,
    ORDER_TYPES_MAP,
  } = applicationContext.getConstants();

  const orderDocumentTypes = ORDER_TYPES_MAP.map(
    orderDoc => orderDoc.documentType,
  );

  const result = cloneDeep(workItem);

  result.createdAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.createdAt, 'MMDDYY');

  result.highPriority = !!result.highPriority;
  result.sentBySection = capitalize(result.sentBySection);
  result.completedAtFormatted = formatDateIfToday(
    result.completedAt,
    applicationContext,
  );
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

  result.receivedAt = isDateToday(
    result.document.receivedAt,
    applicationContext,
  )
    ? result.document.createdAt
    : result.document.receivedAt;
  result.received = formatDateIfToday(result.receivedAt, applicationContext);

  result.sentDateFormatted = formatDateIfToday(
    result.createdAt,
    applicationContext,
  );

  result.isCourtIssuedDocument = !!COURT_ISSUED_DOCUMENT_TYPES.includes(
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
}) => {
  const result = cloneDeep(workItem);

  const formattedDocument = applicationContext
    .getUtilities()
    .formatDocument(applicationContext, result.document);

  const isInProgress = workItem.inProgress;

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
      (permissions.DOCKET_ENTRY && formattedDocument.isInProgress) ||
      (permissions.QC_PETITION &&
        formattedDocument.isPetition &&
        formattedDocument.isInProgress));

  const documentDetailLink = `/case-detail/${workItem.docketNumber}/documents/${workItem.document.documentId}`;
  const documentViewLink = `/case-detail/${workItem.docketNumber}/document-view?documentId=${workItem.document.documentId}`;

  let editLink = documentDetailLink;
  if (showDocumentEditLink) {
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
        editLink = documentViewLink;
      }
    } else if (formattedDocument.isPetition && !formattedDocument.servedAt) {
      if (result.caseIsInProgress) {
        editLink += '/review';
      } else {
        editLink = `/case-detail/${workItem.docketNumber}/petition-qc`;
      }
    } else {
      editLink = documentViewLink;
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

  const { box, queue } = workQueueToDisplay;
  let docQCUserSection = user.section;

  if (user.section !== PETITIONS_SECTION) {
    docQCUserSection = DOCKET_SECTION;
  }

  let additionalFilters = filterQcItemsByAssociatedJudge({
    applicationContext,
    judgeUser,
  });

  const filters = {
    my: {
      inProgress: item => {
        return (
          // DocketClerks
          (item.assigneeId === user.userId &&
            user.role === USER_ROLES.docketClerk &&
            !item.completedAt &&
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
          item.section === user.section &&
          item.document.isFileAttached !== false &&
          !item.inProgress &&
          item.caseIsInProgress !== true
        );
      },
      outbox: item => {
        return (
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
          (user.role === USER_ROLES.petitionsClerk ? !!item.section : true)
        );
      },
    },
  };

  const composedFilter = filters[queue][box];
  return composedFilter;
};

export const formattedWorkQueue = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const workItems = get(state.workQueue);
  const workQueueToDisplay = get(state.workQueueToDisplay);
  const permissions = get(state.permissions);
  const selectedWorkItems = get(state.selectedWorkItems);

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
    my: {
      inProgress: 'receivedAt',
      inbox: 'receivedAt',
      outbox: 'completedAt',
    },
    section: {
      inProgress: 'receivedAt',
      inbox: 'receivedAt',
      outbox: 'completedAt',
    },
  };

  const sortDirections = {
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
  };

  const sortField =
    sortFields[workQueueToDisplay.queue][workQueueToDisplay.box];

  const sortDirection =
    sortDirections[workQueueToDisplay.queue][workQueueToDisplay.box];

  let highPriorityField = [];
  let highPriorityDirection = [];
  if (workQueueToDisplay.box == 'inbox') {
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
