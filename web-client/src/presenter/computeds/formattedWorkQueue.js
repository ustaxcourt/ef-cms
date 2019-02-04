import _ from 'lodash';
import { state } from 'cerebral';
import moment from 'moment';

const DATE_FORMAT_LONG = 'MM/DD/YYYY hh:mm a';
const DATE_TODAY_TIME = 'LT';
const DATE_MMDDYYYY = 'L';

const formatDateIfToday = date => {
  const now = moment();
  const then = moment(date);
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
  result.createdAtFormatted = moment(result.createdAt).format(DATE_MMDDYYYY);
  result.messages = _.orderBy(result.messages, 'createdAt', 'desc');
  result.messages.forEach(message => {
    message.createdAtFormatted = formatDateIfToday(message.createdAt);
    message.sentTo = message.sentTo || 'Unassigned';
    message.createdAtTimeFormatted = moment(message.createdAt).format(
      DATE_FORMAT_LONG,
    );
  });
  result.assigneeName = result.assigneeName || 'Unassigned';
  result.caseStatus =
    result.caseStatus === 'general' ? 'General Docket' : result.caseStatus;
  result.caseStatus = _.startCase(result.caseStatus);

  result.showBatchedStatusIcon = result.caseStatus === 'Batched For IRS'; // TODO

  result.docketNumberWithSuffix = `${
    result.docketNumber
  }${result.docketNumberSuffix || ''}`;

  result.selected = !!selectedWorkItems.find(
    workItem => workItem.workItemId == result.workItemId,
  );

  result.currentMessage = result.messages[0];
  result.sentDateFormatted = formatDateIfToday(result.currentMessage);
  result.historyMessages = result.messages.slice(1);

  return result;
};

export const formattedWorkQueue = get => {
  const workItems = get(state.workQueue);
  const selectedWorkItems = get(state.selectedWorkItems);
  return workItems
    .filter(items => !items.completedAt)
    .map(items => formatWorkItem(items, selectedWorkItems));
};
