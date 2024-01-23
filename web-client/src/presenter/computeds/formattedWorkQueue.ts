import { ClientApplicationContext } from '@web-client/applicationContext';
import { DocketEntry } from '../../../../shared/src/business/entities/DocketEntry';
import { Get } from 'cerebral';
import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { capitalize, cloneDeep, map, memoize, orderBy } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

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

/**
 * formatDateIfToday
 * @param {*} date the date to format
 * @param {*} applicationContext our UI application context
 * @param {*} now optional now value used for large tables to avoid recalculating
 * @param {*} yesterday optional yesterday value used for large tables to avoid recalculating
 * @returns {string} formatted date as a string
 */
export const formatDateIfToday = (
  date,
  applicationContext,
  now = null,
  yesterday = null,
) => {
  const then = applicationContext
    .getUtilities()
    .formatDateString(date, 'MMDDYY');
  now = now || applicationContext.getUtilities().formatNow('MMDDYY');
  yesterday =
    yesterday ||
    applicationContext.getUtilities().formatDateString(
      applicationContext.getUtilities().calculateISODate({
        howMuch: -1,
      }),
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
  isSelected,
  workItem = {},
}: {
  applicationContext: ClientApplicationContext;
  isSelected: boolean;
  workItem: RawWorkItem;
}) => {
  const { COURT_ISSUED_EVENT_CODES, ORDER_TYPES_MAP } =
    applicationContext.getConstants();

  const orderDocumentTypes = ORDER_TYPES_MAP.map(
    orderDoc => orderDoc.documentType,
  );

  // const result = cloneDeep(workItem);

  const inConsolidatedGroup = !!workItem.leadDocketNumber;
  const inLeadCase = applicationContext.getUtilities().isLeadCase(workItem);

  let consolidatedIconTooltipText = '';

  if (inConsolidatedGroup) {
    if (inLeadCase) {
      consolidatedIconTooltipText = 'Lead case';
    } else {
      consolidatedIconTooltipText = 'Consolidated case';
    }
  }

  const formattedCaseStatus = setFormattedCaseStatus({
    applicationContext,
    workItem,
  });

  const createdAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(workItem.createdAt, 'MMDDYY');

  workItem.highPriority = !!workItem.highPriority;
  workItem.sentBySection = capitalize(workItem.sentBySection);
  const completedAtFormatted = formatDateIfToday(
    workItem.completedAt,
    applicationContext,
  );
  const completedAtFormattedTZ = applicationContext
    .getUtilities()
    .formatDateString(workItem.completedAt, 'DATE_TIME_TZ');
  workItem.assigneeName = workItem.assigneeName || 'Unassigned';

  const showHighPriorityIcon = !!workItem.highPriority;

  const showUnreadIndicators = !workItem.isRead;
  const showUnreadStatusIcon = !workItem.isRead && !showHighPriorityIcon;

  let showUnassignedIcon = false;
  if (workItem.assigneeName === 'Unassigned' && !showHighPriorityIcon) {
    showUnassignedIcon = true;
  }

  const selected = !!isSelected;

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

  return {
    ...workItem,
    completedAtFormatted,
    completedAtFormattedTZ,
    consolidatedIconTooltipText,
    createdAtFormatted,
    formattedCaseStatus,
    selected,
    showHighPriorityIcon,
    showUnassignedIcon,
    showUnreadIndicators,
    showUnreadStatusIcon,
  };
};

const getDocketEntryEditLink = ({
  applicationContext,
  formattedDocument,
  isInProgress,
  qcWorkItemsUntouched,
  result,
  workQueueToDisplay,
}) => {
  const { FROM_PAGES, UNSERVABLE_EVENT_CODES } =
    applicationContext.getConstants();

  const fromPage =
    workQueueToDisplay.queue === 'section'
      ? workQueueToDisplay.box === 'inProgress'
        ? FROM_PAGES.qcSectionInProgress
        : FROM_PAGES.qcSectionInbox
      : workQueueToDisplay.box === 'inProgress'
        ? FROM_PAGES.qcMyInProgress
        : FROM_PAGES.qcMyInbox;

  let editLink;
  if (
    formattedDocument.isCourtIssuedDocument &&
    !formattedDocument.isPaper &&
    !DocketEntry.isServed(formattedDocument) &&
    !UNSERVABLE_EVENT_CODES.includes(formattedDocument.eventCode)
  ) {
    editLink = `/edit-court-issued?fromPage=${fromPage}`;
  } else if (isInProgress) {
    editLink = `/complete?fromPage=${fromPage}`;
  } else if (
    !result.isCourtIssuedDocument &&
    !result.isOrder &&
    !formattedDocument.isPetition &&
    qcWorkItemsUntouched
  ) {
    editLink = `/edit?fromPage=${fromPage}`;
  }
  return editLink;
};

export const getWorkItemDocumentLink = ({
  applicationContext,
  permissions,
  workItem,
  workQueueToDisplay,
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
        workQueueToDisplay,
      });
      if (editLinkExtension) {
        editLink = `${baseDocumentLink}${editLinkExtension}`;
      }
    } else if (
      formattedDocketEntry.isPetition &&
      !DocketEntry.isServed(formattedDocketEntry)
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
  assignmentFilterValue,
  section,
  workItems,
  workQueueToDisplay,
}) => {
  const user = applicationContext.getCurrentUser();
  const { box, queue } = workQueueToDisplay;

  const filters = applicationContext
    .getUtilities()
    .getWorkQueueFilters({ section, user });

  const composedFilter = filters[queue][box];
  let assignmentFilter = workItem => {
    return workItem;
  };

  if (queue === 'section') {
    assignmentFilter = workItem => {
      if (assignmentFilterValue && assignmentFilterValue.userId) {
        if (assignmentFilterValue.userId === 'UA') {
          return workItem.assigneeId === null;
        }
        return (
          workItem.assigneeId === assignmentFilterValue.userId ||
          workItem.completedBy === assignmentFilterValue.name
        );
      }
      return workItem;
    };
  }

  const filteredWorkItems = workItems
    .filter(composedFilter)
    .filter(assignmentFilter);

  return filteredWorkItems;
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

export const formattedWorkQueue = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const section = get(state.workQueueToDisplay.section);
  const workItems = get(state.workQueue);
  const workQueueToDisplay = get(state.workQueueToDisplay);
  const permissions = get(state.permissions);
  const selectedWorkItems = get(state.selectedWorkItems);
  const selectedWorkItemIds = map(selectedWorkItems, 'workItemId');
  let { assignmentFilterValue } = get(state.screenMetadata);
  let { STATUS_TYPES } = applicationContext.getConstants();
  const users = get(state.users);

  if (assignmentFilterValue && assignmentFilterValue.userId !== 'UA') {
    assignmentFilterValue = users.find(
      user => user.userId === assignmentFilterValue.userId,
    );
  }

  let workQueue = filterWorkItems({
    applicationContext,
    assignmentFilterValue,
    section,
    workItems,
    workQueueToDisplay,
  }).map(workItem => {
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
  let sortField = sortFields[workQueueToDisplay.queue][workQueueToDisplay.box];
  let sortDirection =
    sortDirections[workQueueToDisplay.queue][workQueueToDisplay.box];

  let highPriorityField = [];
  let highPriorityDirection = [];
  if (workQueueToDisplay.box == 'inbox') {
    const caseStatusSortRank = {
      [STATUS_TYPES.submitted]: 1,
      [STATUS_TYPES.assignedCase]: 2,
      [STATUS_TYPES.assignedMotion]: 3,
      [STATUS_TYPES.jurisdictionRetained]: 4,
    };

    highPriorityField = [
      'highPriority',
      'trialDate',
      workItemToSort => caseStatusSortRank[workItemToSort.caseStatus],
    ];
    highPriorityDirection = ['desc', 'asc', 'asc'];
  }

  workQueue = orderBy(
    workQueue,
    [...highPriorityField, sortField, 'docketNumber'],
    [...highPriorityDirection, sortDirection, 'asc'],
  );

  return workQueue;
};

const setFormattedCaseStatus = ({ applicationContext, workItem }): string => {
  const { STATUS_TYPES, TRIAL_SESSION_SCOPE_TYPES } =
    applicationContext.getConstants();
  let formattedCaseStatus: string = workItem.caseStatus;

  if (
    workItem.caseStatus === STATUS_TYPES.calendared &&
    workItem.trialLocation &&
    workItem.trialDate
  ) {
    let formattedTrialLocation = '';
    if (workItem.trialLocation !== TRIAL_SESSION_SCOPE_TYPES.standaloneRemote) {
      formattedTrialLocation = applicationContext
        .getUtilities()
        .abbreviateState(workItem.trialLocation ?? '');
    } else {
      formattedTrialLocation = workItem.trialLocation;
    }

    const formattedTrialDate = applicationContext
      .getUtilities()
      .formatDateString(workItem.trialDate, 'MMDDYY');

    formattedCaseStatus = `Calendared - ${formattedTrialDate} ${formattedTrialLocation}`;
  }

  return formattedCaseStatus;
};
