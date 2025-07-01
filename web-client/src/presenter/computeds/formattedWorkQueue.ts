import {
  applicationContext,
  ClientApplicationContext,
} from '@web-client/applicationContext';
import { DocketEntry } from '../../../../shared/src/business/entities/DocketEntry';
import { Get } from 'cerebral';
import {
  AuthUser,
  UnknownAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { capitalize, cloneDeep, orderBy } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { WorkItemWithCaseInfo } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import {
  CASE_STATUS_TYPES,
  COURT_ISSUED_EVENT_CODES,
  ORDER_TYPES,
  ROLES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '@shared/business/entities/EntityConstants';
import { isLeadCase } from '@shared/business/entities/cases/Case';
import { abbreviateState } from '@shared/business/utilities/abbreviateState';
import {
  calculateISODate,
  formatDateString,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import { formatDocketEntry } from '@shared/business/utilities/getFormattedCaseDetail';
import { WorkItem } from '@shared/business/entities/WorkItem';
import { getWorkQueueFilters } from '@shared/business/utilities/getWorkQueueFilters';

export const formattedWorkQueue = (
  get: Get,
  applicationContext: ClientApplicationContext,
): FormattedWorkItemWithCaseInfo[] => {
  const section = get(state.workQueueToDisplay.section);
  const workItems = get(state.workQueue);
  const workQueueToDisplay = get(state.workQueueToDisplay);
  const permissions = get(state.permissions);
  const selectedWorkItems = get(state.selectedWorkItems);
  const selectedWorkItemIds: string[] = selectedWorkItems.map(
    wi => wi.workItemId,
  );
  let { assignmentFilterValue } = get(state.screenMetadata);
  const { STATUS_TYPES } = applicationContext.getConstants();
  const users = get(state.users);
  const authorizedUser = get(state.user);

  if (assignmentFilterValue && assignmentFilterValue.userId !== 'UA') {
    assignmentFilterValue = users.find(
      user => user.userId === assignmentFilterValue.userId,
    );
  }

  let workQueue: FormattedWorkItemWithCaseInfo[] = filterWorkItems({
    assignmentFilterValue,
    authorizedUser,
    section,
    workItems,
    workQueueToDisplay,
  })
    .map(workItem =>
      formatWorkItem({
        isSelected: selectedWorkItemIds.includes(workItem.workItemId),
        workItem,
      }),
    )
    .map(workItem => {
      const editLink = getWorkItemDocumentLink({
        authorizedUser,
        permissions,
        workItem,
        workQueueToDisplay,
      });
      return {
        ...workItem,
        editLink,
      };
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

const isDateToday = (date: string) => {
  const now = formatNow('MMDDYY');
  const then = formatDateString(date, 'MMDDYY');
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
  now = null,
  yesterday = null,
): string => {
  const then = formatDateString(date, 'MMDDYY');
  now = now || formatNow('MMDDYY');
  yesterday =
    yesterday ||
    formatDateString(
      calculateISODate({
        howMuch: -1,
      }),
      'MMDDYY',
    );

  let formattedDate: string;
  if (now == then) {
    formattedDate = formatDateString(date, 'TIME_TZ');
  } else if (then === yesterday) {
    formattedDate = 'Yesterday';
  } else {
    formattedDate = then;
  }
  return formattedDate;
};

export const formatWorkItem = ({
  isSelected = false,
  workItem = {} as WorkItemWithCaseInfo,
}: {
  isSelected?: boolean;
  workItem: WorkItemWithCaseInfo;
}): WorkItemWithCaseInfo & {
  assigneeName: string;
  completedAtFormatted: string;
  completedAtFormattedTZ: string;
  consolidatedIconTooltipText: string;
  createdAtFormatted: string;
  docketEntry: any;
  formattedCaseStatus: string;
  highPriority: boolean;
  inConsolidatedGroup: boolean;
  inLeadCase: boolean;
  isCourtIssuedDocument: boolean;
  isOrder: boolean;
  received: string;
  receivedAt: any;
  selected: boolean;
  sentBySection: string;
  sentDateFormatted: string;
  showHighPriorityIcon: boolean;
  showUnassignedIcon: boolean;
  showUnreadIndicators: boolean;
  showUnreadStatusIcon: boolean;
} => {
  const orderDocumentTypes = ORDER_TYPES.map(orderDoc => orderDoc.documentType);

  const inConsolidatedGroup = !!workItem.leadDocketNumber;
  const inLeadCase = isLeadCase(workItem);

  let consolidatedIconTooltipText = '';

  if (inConsolidatedGroup) {
    if (inLeadCase) {
      consolidatedIconTooltipText = 'Lead case';
    } else {
      consolidatedIconTooltipText = 'Consolidated case';
    }
  }

  let formattedCaseStatus = workItem.caseStatus || '';

  if (
    workItem.caseStatus === CASE_STATUS_TYPES.calendared &&
    workItem.trialLocation &&
    workItem.trialDate
  ) {
    let formattedTrialLocation = '';
    if (workItem.trialLocation !== TRIAL_SESSION_SCOPE_TYPES.standaloneRemote) {
      formattedTrialLocation = abbreviateState(workItem.trialLocation ?? '');
    } else {
      formattedTrialLocation = workItem.trialLocation;
    }

    const formattedTrialDate = formatDateString(workItem.trialDate, 'MMDDYY');

    formattedCaseStatus = `Calendared - ${formattedTrialDate} ${formattedTrialLocation}`;
  }

  const createdAtFormatted = formatDateString(workItem.createdAt, 'MMDDYY');

  const highPriority = WorkItem.isHighPriority({ status: workItem.caseStatus });
  const sentBySection = capitalize(workItem.sentBySection);
  const completedAtFormatted = formatDateIfToday(workItem.completedAt);
  const completedAtFormattedTZ = formatDateString(
    workItem.completedAt,
    'DATE_TIME_TZ',
  );
  const assigneeName = workItem.assigneeName || 'Unassigned';

  const showHighPriorityIcon = highPriority;

  const showUnreadIndicators = !workItem.isRead;
  const showUnreadStatusIcon = !workItem.isRead && !showHighPriorityIcon;

  let showUnassignedIcon = false;
  if (assigneeName === 'Unassigned' && !showHighPriorityIcon) {
    showUnassignedIcon = true;
  }

  const selected = !!isSelected;

  const receivedAt = isDateToday(workItem.docketEntry.receivedAt)
    ? workItem.docketEntry.createdAt
    : workItem.docketEntry.receivedAt;

  const received = formatDateIfToday(receivedAt);

  const sentDateFormatted = formatDateIfToday(workItem.createdAt);

  const isCourtIssuedDocument = !!COURT_ISSUED_EVENT_CODES.map(
    ({ eventCode }) => eventCode,
  ).includes(workItem.docketEntry.eventCode);

  const isOrder = !!orderDocumentTypes.includes(
    workItem.docketEntry.documentType || '',
  );

  let descriptionDisplay = workItem.docketEntry.documentType;
  if (workItem.docketEntry.documentTitle) {
    descriptionDisplay = workItem.docketEntry.documentTitle;
    if (workItem.docketEntry.additionalInfo) {
      descriptionDisplay += ` ${workItem.docketEntry.additionalInfo}`;
    }
  }

  return {
    ...workItem,
    assigneeName,
    completedAtFormatted,
    completedAtFormattedTZ,
    consolidatedIconTooltipText,
    createdAtFormatted,
    docketEntry: {
      ...workItem.docketEntry,
      descriptionDisplay,
    },
    formattedCaseStatus,
    highPriority,
    inConsolidatedGroup,
    inLeadCase,
    isCourtIssuedDocument,
    isOrder,
    received,
    receivedAt,
    selected,
    sentBySection,
    sentDateFormatted,
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
}: {
  applicationContext: ClientApplicationContext;
  formattedDocument: any;
  isInProgress: boolean;
  qcWorkItemsUntouched: boolean;
  result: any;
  workQueueToDisplay: any;
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
  authorizedUser,
  permissions,
  workItem,
  workQueueToDisplay,
}: {
  permissions: any;
  workItem: any;
  workQueueToDisplay: any;
  authorizedUser: UnknownAuthUser;
}) => {
  const result = cloneDeep(workItem);

  const formattedDocketEntry = formatDocketEntry(
    applicationContext,
    result.docketEntry,
  );

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
    if (
      permissions.DOCKET_ENTRY &&
      (authorizedUser?.role !== ROLES.caseServicesSupervisor ||
        !formattedDocketEntry.isPetition)
    ) {
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
      if (result.inProgress) {
        editLink = `${baseDocumentLink}/review`;
      } else {
        editLink = `/case-detail/${workItem.docketNumber}/petition-qc`;
      }
    }
  }

  return editLink;
};

export const filterWorkItems = ({
  assignmentFilterValue,
  authorizedUser,
  section,
  workItems,
  workQueueToDisplay,
}: {
  assignmentFilterValue: any;
  section: string;
  workItems: WorkItemWithCaseInfo[];
  workQueueToDisplay: {
    box: string;
    queue: string;
    section: string;
  };
  authorizedUser: AuthUser;
}): WorkItemWithCaseInfo[] => {
  const { box, queue } = workQueueToDisplay;

  const filters = getWorkQueueFilters({ section, user: authorizedUser });

  const composedFilter = filters[queue][box];

  let filteredWorkItems = workItems.filter(composedFilter);
  if (queue === 'section') {
    filteredWorkItems = filteredWorkItems.filter(
      (workItem: WorkItemWithCaseInfo) => {
        if (assignmentFilterValue && assignmentFilterValue.userId) {
          if (assignmentFilterValue.userId === 'UA') {
            return !workItem.assigneeId;
          }
          return (
            workItem.assigneeId === assignmentFilterValue.userId ||
            workItem.completedBy === assignmentFilterValue.name
          );
        }
        return workItem;
      },
    );
  }

  return filteredWorkItems;
};

export type FormattedWorkItemWithCaseInfo = WorkItemWithCaseInfo & {
  assigneeName: string;
  completedAtFormatted: string;
  completedAtFormattedTZ: string;
  consolidatedIconTooltipText: string;
  createdAtFormatted: string;
  docketEntry: any;
  editLink: string;
  formattedCaseStatus: string;
  highPriority: boolean;
  inConsolidatedGroup: boolean;
  inLeadCase: boolean;
  isCourtIssuedDocument: boolean;
  isOrder: boolean;
  received: string;
  receivedAt: any;
  selected: boolean;
  sentBySection: string;
  sentDateFormatted: string;
  showHighPriorityIcon: boolean;
  showUnassignedIcon: boolean;
  showUnreadIndicators: boolean;
  showUnreadStatusIcon: boolean;
};
