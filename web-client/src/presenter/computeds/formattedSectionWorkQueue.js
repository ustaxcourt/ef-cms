import _ from 'lodash';
import { formatWorkItem } from './formattedWorkQueue';
import { state } from 'cerebral';

export const formattedSectionWorkQueue = get => {
  const workItems = get(state.workQueue);
  const selectedWorkItems = get(state.selectedWorkItems);
  let workQueue = workItems
    .filter(items => !items.completedAt)
    .map(items => formatWorkItem(items, selectedWorkItems));

  workQueue = _.orderBy(workQueue, 'currentMessage.createdAt', 'desc');
  return workQueue;
};
