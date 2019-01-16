import _ from 'lodash';
import { state } from 'cerebral';
import moment from 'moment';

export const formatWorkItem = (workItem, selectedWorkItems = []) => {
  const result = _.cloneDeep(workItem);
  result.createdAtFormatted = moment(result.createdAt).format('L');
  result.messages = _.orderBy(result.messages, 'createdAt', 'desc');
  result.messages.forEach(message => {
    const now = moment();
    const then = moment(message.createdAt);
    if (now.format('L') == then.format('L')) {
      message.createdAtFormatted = then.format('LT');
    } else {
      message.createdAtFormatted = then.format('L');
    }
    message.sentTo = message.sentTo || 'Unassigned';
    message.createdAtTimeFormatted = moment(message.createdAt).format(
      'MM/DD/YYYY hh:mm a',
    );
  });
  result.assigneeName = result.assigneeName || 'Unassigned';
  result.caseStatus =
    result.caseStatus === 'general' ? 'General Docket' : result.caseStatus;

  result.docketNumberWithSuffix = `${result.docketNumber}${
    result.docketNumberSuffix
  }`;

  result.selected = !!selectedWorkItems.find(
    workItem => workItem.workItemId == result.workItemId,
  );

  result.currentMessage = result.messages[0];
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
