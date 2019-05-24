import { state } from 'cerebral';
import _ from 'lodash';

const formatDateIfToday = (date, applicationContext) => {
  const now = applicationContext
    .getUtilities()
    .formatDateString(undefined, 'MMDDYY');
  const then = applicationContext
    .getUtilities()
    .formatDateString(date, 'MMDDYY');
  let formattedDate;
  if (now == then) {
    formattedDate = applicationContext
      .getUtilities()
      .formatDateString(date, 'TIME');
  } else {
    formattedDate = then;
  }
  return formattedDate;
};

export const formatWorkItem = (
  workItem,
  selectedWorkItems = [],
  applicationContext,
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

  result.showComplete = !result.isInitializeCase;
  result.showSendTo = !result.isInitializeCase;
  if (!result.isRead) {
    result.showUnreadStatusIcon = true;
  }
  switch (result.caseStatus.trim()) {
    case 'Batched for IRS':
      result.showBatchedStatusIcon = true;
      result.showUnreadStatusIcon = false;
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

  result.docketNumberWithSuffix = `${
    result.docketNumber
  }${result.docketNumberSuffix || ''}`;

  result.selected = !!selectedWorkItems.find(
    workItem => workItem.workItemId == result.workItemId,
  );

  result.currentMessage = result.messages[0];
  result.sentDateFormatted = formatDateIfToday(
    result.currentMessage.createdAt,
    applicationContext,
  );
  result.historyMessages = result.messages.slice(1);

  return result;
};

export const formattedWorkQueue = (get, applicationContext) => {
  const workItems = get(state.workQueue);
  const box = get(state.workQueueToDisplay.box);
  const selectedWorkItems = get(state.selectedWorkItems);
  let workQueue = workItems
    .filter(items => (box === 'inbox' ? !items.completedAt : true))
    .map(items => formatWorkItem(items, selectedWorkItems, applicationContext));

  workQueue = _.orderBy(workQueue, 'currentMessage.createdAt', 'desc');

  return workQueue;
};
