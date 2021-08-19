import { capitalize, cloneDeep, map, memoize, orderBy } from 'lodash';
import { state } from 'cerebral';

const isDateToday = (date, applicationContext) => {
  const now = applicationContext.getUtilities().formatNow('MMDDYY');
  const then = applicationContext
    .getUtilities()
    .formatDateString(date, 'MMDDYY');
  return now === then;
};

export const workQueueItemsAreEqual = (first, second) => {
  return JSON.stringify(first.item) === JSON.stringify(second.item);
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
  isSelected,
}) => {
  const { COURT_ISSUED_EVENT_CODES, ORDER_TYPES_MAP } =
    applicationContext.getConstants();

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

  result.selected = !!isSelected;

  result.receivedAt = isDateToday(
    result.docketEntry.receivedAt,
    applicationContext,
  )
    ? result.docketEntry.createdAt
    : result.docketEntry.receivedAt;
  result.received = formatDateIfToday(result.receivedAt, applicationContext);

  result.sentDateFormatted = formatDateIfToday(
    result.createdAt,
    applicationContext,
  );

  result.isCourtIssuedDocument = !!COURT_ISSUED_EVENT_CODES.map(
    ({ eventCode }) => eventCode,
  ).includes(result.docketEntry.eventCode);

  result.isOrder = !!orderDocumentTypes.includes(
    result.docketEntry.documentType,
  );

  let descriptionDisplay = result.docketEntry.documentType;

  if (result.docketEntry.documentTitle) {
    descriptionDisplay = result.docketEntry.documentTitle;
    if (result.docketEntry.additionalInfo) {
      descriptionDisplay += ` ${result.docketEntry.additionalInfo}`;
    }
  }

  result.docketEntry.descriptionDisplay = descriptionDisplay;

  return result;
};

const getDocketEntryEditLink = ({
  applicationContext,
  formattedDocument,
  isInProgress,
  qcWorkItemsUntouched,
  result,
}) => {
  const { UNSERVABLE_EVENT_CODES } = applicationContext.getConstants();

  let editLink;
  if (
    formattedDocument.isCourtIssuedDocument &&
    !applicationContext.getUtilities().isServed(formattedDocument) &&
    !UNSERVABLE_EVENT_CODES.includes(formattedDocument.eventCode)
  ) {
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

  const formattedDocketEntry = applicationContext
    .getUtilities()
    .formatDocketEntry(applicationContext, result.docketEntry);

  const isInProgress = workItem.inProgress;

  const qcWorkItemsUntouched =
    !isInProgress &&
    formattedDocketEntry &&
    !result.completedAt &&
    !result.isCourtIssuedDocument;

  const showDocumentEditLink =
    formattedDocketEntry &&
    permissions.UPDATE_CASE &&
    (!formattedDocketEntry.isInProgress ||
      (permissions.DOCKET_ENTRY && formattedDocketEntry.isInProgress) ||
      (permissions.QC_PETITION &&
        formattedDocketEntry.isPetition &&
        formattedDocketEntry.isInProgress));

  const baseDocumentLink = `/case-detail/${workItem.docketNumber}/documents/${workItem.docketEntry.docketEntryId}`;
  const documentViewLink = `/case-detail/${workItem.docketNumber}/document-view?docketEntryId=${workItem.docketEntry.docketEntryId}`;

  let editLink = documentViewLink;
  if (showDocumentEditLink) {
    if (permissions.DOCKET_ENTRY) {
      const editLinkExtension = getDocketEntryEditLink({
        applicationContext,
        formattedDocument: formattedDocketEntry,
        isInProgress,
        qcWorkItemsUntouched,
        result,
      });
      if (editLinkExtension) {
        editLink = `${baseDocumentLink}${editLinkExtension}`;
      }
    } else if (
      formattedDocketEntry.isPetition &&
      !applicationContext.getUtilities().isServed(formattedDocketEntry)
    ) {
      if (result.caseIsInProgress) {
        editLink = `${baseDocumentLink}/review`;
      } else {
        editLink = `/case-detail/${workItem.docketNumber}/petition-qc`;
      }
    }
  }

  return editLink;
};

export const filterWorkItems = ({
  applicationContext,
  user,
  workQueueToDisplay,
}) => {
  const { box, queue } = workQueueToDisplay;

  const filters = applicationContext
    .getUtilities()
    .getWorkQueueFilters({ user });

  const composedFilter = filters[queue][box];
  return composedFilter;
};

const memoizedFormatItemWithLink = memoize(
  ({
    applicationContext,
    isSelected,
    permissions,
    workItem,
    workQueueToDisplay,
  }) => {
    const result = formatWorkItem({
      applicationContext,
      isSelected,
      workItem,
    });
    const editLink = getWorkItemDocumentLink({
      applicationContext,
      permissions,
      workItem,
      workQueueToDisplay,
    });
    return { ...result, editLink };
  },
  ({ isSelected, workItem, workQueueToDisplay }) =>
    JSON.stringify({ ...workItem, isSelected, workQueueToDisplay }),
);

export const formattedWorkQueue = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const workItems = get(state.workQueue);
  const workQueueToDisplay = get(state.workQueueToDisplay);
  const permissions = get(state.permissions);
  const selectedWorkItems = get(state.selectedWorkItems);
  const selectedWorkItemIds = map(selectedWorkItems, 'workItemId');

  let workQueue = workItems
    .filter(
      filterWorkItems({
        applicationContext,
        user,
        workQueueToDisplay,
      }),
    )
    .map(workItem => {
      return memoizedFormatItemWithLink({
        applicationContext,
        isSelected: selectedWorkItemIds.includes(workItem.workItemId),
        permissions,
        workItem,
        workQueueToDisplay,
      });
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
