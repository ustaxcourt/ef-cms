import _ from 'lodash';
import { state } from 'cerebral';
import moment from 'moment';

export const formatWorkItem = (workItem, selectedWorkItems) => {
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
  });
  result.assigneeName = result.assigneeName || 'Unassigned';
  result.caseStatus =
    result.caseStatus === 'general' ? 'General Docket' : result.caseStatus;

  result.selected = !!selectedWorkItems.find(
    workItem => workItem.workItemId == result.workItemId,
  );

  return result;
};

export const formattedWorkQueue = get => {
  const workItems = get(state.workQueue);
  const selectedWorkItems = get(state.selectedWorkItems);
  return workItems.map(items => formatWorkItem(items, selectedWorkItems));
};
