import { state } from 'cerebral';
import _ from 'lodash';
import moment from 'moment';

const DATE_FORMAT_LONG = 'MM/DD/YYYY hh:mm a';
const DATE_TODAY_TIME = 'LT';
const DATE_MMDDYYYY = 'L';

const formatDateIfToday = date => {
  const now = moment();
  const then = moment(date).local();
  let formattedDate;
  if (now.format(DATE_MMDDYYYY) == then.format(DATE_MMDDYYYY)) {
    formattedDate = then.format(DATE_TODAY_TIME);
  } else {
    formattedDate = then.format(DATE_MMDDYYYY);
  }
  return formattedDate;
};

export const formatWorkItem = (workItem, selectedWorkItems = []) => {
  const result = _.cloneDeep(workItem);
  result.createdAtFormatted = moment
    .utc(result.createdAt)
    .format(DATE_MMDDYYYY);
  result.messages = _.orderBy(result.messages, 'createdAt', 'desc');
  result.messages.forEach(message => {
    message.createdAtFormatted = formatDateIfToday(message.createdAt);
    message.to = message.to || 'Unassigned';
    message.createdAtTimeFormatted = moment
      .utc(message.createdAt)
      .local()
      .format(DATE_FORMAT_LONG);
  });
  result.sentBySection = _.capitalize(result.sentBySection);
  result.completedAtFormatted = moment
    .utc(result.completedAt)
    .local()
    .format(DATE_FORMAT_LONG);
  result.assigneeName = result.assigneeName || 'Unassigned';

  result.showComplete = !result.isInitializeCase;
  result.showSendTo = !result.isInitializeCase;
  switch (result.caseStatus.trim()) {
    case 'Batched for IRS':
      result.showBatchedStatusIcon = true;
      result.statusIcon = 'iconStatusBatched';
      break;
    case 'Recalled':
      result.showBatchedStatusIcon = true;
      result.statusIcon = 'iconStatusRecalled';
      break;
    case 'General Docket':
      result.caseStatus = 'General Docket';
      result.statusIcon = '';
      result.showBatchedStatusIcon = false;
      break;
    case 'New':
    default:
      result.statusIcon = '';
      result.showBatchedStatusIcon = false;
  }

  result.docketNumberWithSuffix = `${
    result.docketNumber
  }${result.docketNumberSuffix || ''}`;

  result.selected = !!selectedWorkItems.find(
    workItem => workItem.workItemId == result.workItemId,
  );

  result.currentMessage = result.messages[0];
  result.sentDateFormatted = formatDateIfToday(result.currentMessage.createdAt);
  result.historyMessages = result.messages.slice(1);

  return result;
};

export const formattedWorkQueue = get => {
  const workItems = get(state.workQueue);
  const box = get(state.workQueueToDisplay.box);
  const selectedWorkItems = get(state.selectedWorkItems);
  let workQueue = workItems
    .filter(items => (box === 'inbox' ? !items.completedAt : true))
    .map(items => formatWorkItem(items, selectedWorkItems));

  workQueue = _.orderBy(workQueue, 'currentMessage.createdAt', 'desc');
  return workQueue;
};
