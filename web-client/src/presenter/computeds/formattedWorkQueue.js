import { Case } from '../../../../shared/src/business/entities/cases/Case';
import {
  DOCKET_SECTION,
  IRS_BATCH_SYSTEM_SECTION,
  SENIOR_ATTORNEY_SECTION,
  getSectionForRole,
} from '../../../../shared/src/business/entities/WorkQueue';
import { state } from 'cerebral';
import _ from 'lodash';
import moment from 'moment';

const isDateToday = (date, applicationContext) => {
  const now = applicationContext
    .getUtilities()
    .formatDateString(new Date(), 'MMDDYY');
  const then = applicationContext
    .getUtilities()
    .formatDateString(date, 'MMDDYY');
  return now === then;
};

const formatDateIfToday = (date, applicationContext) => {
  const now = applicationContext
    .getUtilities()
    .formatDateString(new Date(), 'MMDDYY');
  const then = applicationContext
    .getUtilities()
    .formatDateString(date, 'MMDDYY');
  const yesterday = applicationContext.getUtilities().formatDateString(
    moment(new Date())
      .add(-1, 'days')
      .toDate(),
    'MMDDYY',
  );

  let formattedDate;
  if (now == then) {
    formattedDate = applicationContext
      .getUtilities()
      .formatDateString(date, 'TIME');
  } else if (then === yesterday) {
    formattedDate = 'Yesterday';
  } else {
    formattedDate = then;
  }
  return formattedDate;
};

export const formatWorkItem = (
  applicationContext,
  workItem = {},
  selectedWorkItems = [],
  isInternal,
) => {
  const result = _.cloneDeep(workItem);

  result.createdAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.createdAt, 'MMDDYY');

  result.messages = _.orderBy(result.messages, 'createdAt', 'desc');
  result.messages.forEach(message => {
    message.createdAtFormatted = formatDateIfToday(
      message.createdAt,
      applicationContext,
    );
    message.to = message.to || 'Unassigned';
    message.createdAtTimeFormatted = applicationContext
      .getUtilities()
      .formatDateString(message.createdAt, 'DATE_TIME');
  });
  result.sentBySection = _.capitalize(result.sentBySection);
  result.completedAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.completedAt, 'DATE_TIME');
  result.assigneeName = result.assigneeName || 'Unassigned';

  result.showUnreadIndicators = !result.isRead;
  result.showUnreadStatusIcon = !result.isRead;

  result.showComplete = !result.isInitializeCase;
  result.showSendTo = !result.isInitializeCase;

  if (result.assigneeName === 'Unassigned') {
    result.showUnassignedIcon = true;
  }

  switch (result.caseStatus.trim()) {
    case 'Batched for IRS':
      result.showBatchedStatusIcon = true;
      result.showUnreadStatusIcon = false;
      result.showUnassignedIcon = false;
      break;
    case 'Recalled':
      result.showRecalledStatusIcon = true;
      result.showUnreadStatusIcon = false;
      break;
    case 'General Docket - Not at Issue':
    case 'New':
    default:
      result.showBatchedStatusIcon = false;
      result.showRecalledStatusIcon = false;
  }

  if (applicationContext.getCurrentUser().role !== 'petitionsclerk') {
    result.showRecalledStatusIcon = false;
    result.showBatchedStatusIcon = false;
  }

  result.docketNumberWithSuffix = `${
    result.docketNumber
  }${result.docketNumberSuffix || ''}`;

  result.selected = !!selectedWorkItems.find(
    workItem => workItem.workItemId == result.workItemId,
  );

  result.currentMessage = result.messages[0];

  result.receivedAt = isInternal
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
    ).createdAtTimeFormatted;
  }

  return result;
};

export const filterWorkItems = ({
  user,
  workQueueIsInternal,
  workQueueToDisplay,
}) => {
  const { box, queue } = workQueueToDisplay;
  const userSection = getSectionForRole(user.role);
  const docQCUserSection =
    userSection === SENIOR_ATTORNEY_SECTION ? DOCKET_SECTION : userSection;

  const filters = {
    documentQc: {
      my: {
        batched: item => {
          return (
            !item.completedAt &&
            !item.isInternal &&
            item.sentByUserId === user.userId &&
            item.section === IRS_BATCH_SYSTEM_SECTION &&
            item.caseStatus === Case.STATUS_TYPES.batchedForIRS
          );
        },
        inbox: item => {
          return (
            item.assigneeId === user.userId &&
            !item.completedAt &&
            !item.isInternal &&
            item.section === userSection
          );
        },
        outbox: item => {
          return (
            !item.isInternal &&
            (user.role === 'petitionsclerk'
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
            !item.isInternal &&
            item.section === IRS_BATCH_SYSTEM_SECTION &&
            item.caseStatus === Case.STATUS_TYPES.batchedForIRS
          );
        },
        inbox: item => {
          return (
            !item.completedAt &&
            !item.isInternal &&
            item.section === docQCUserSection
          );
        },
        outbox: item => {
          return (
            !!item.completedAt &&
            !item.isInternal &&
            (user.role === 'petitionsclerk'
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
            item.isInternal &&
            item.section === userSection &&
            item.assigneeId === user.userId
          );
        },
        outbox: item => {
          return (
            !item.completedAt &&
            item.isInternal &&
            item.sentByUserId &&
            item.sentByUserId === user.userId
          );
        },
      },
      section: {
        inbox: item => {
          return (
            !item.completedAt && item.isInternal && item.section === userSection
          );
        },
        outbox: item => {
          return (
            !item.completedAt &&
            item.isInternal &&
            item.sentBySection === userSection
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
  const isInternal = get(state.workQueueIsInternal);
  const selectedWorkItems = get(state.selectedWorkItems);

  let workQueue = workItems
    .filter(
      filterWorkItems({
        user,
        workQueueIsInternal: isInternal,
        workQueueToDisplay,
      }),
    )
    .map(item =>
      formatWorkItem(applicationContext, item, selectedWorkItems, isInternal),
    );

  const sortFields = {
    documentQc: {
      my: {
        batched: 'batchedAt',
        inbox: 'receivedAt',
        outbox: user.role === 'petitionsclerk' ? 'completedAt' : 'receivedAt',
      },
      section: {
        batched: 'batchedAt',
        inbox: 'receivedAt',
        outbox: user.role === 'petitionsclerk' ? 'completedAt' : 'receivedAt',
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

  const sortField =
    sortFields[isInternal ? 'messages' : 'documentQc'][
      workQueueToDisplay.queue
    ][workQueueToDisplay.box];

  workQueue = _.orderBy(workQueue, [sortField, 'docketNumber'], 'desc');

  return workQueue;
};
