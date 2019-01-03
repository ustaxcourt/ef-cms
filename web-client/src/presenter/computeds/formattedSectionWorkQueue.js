import _ from 'lodash';
import { state } from 'cerebral';

import { formatWorkItem } from './formattedWorkQueue';

export const formattedSectionWorkQueue = get => {
  const workItems = _.orderBy(get(state.sectionWorkQueue), 'createdAt', 'desc');
  const selectedWorkItems = get(state.selectedWorkItems);
  return workItems
    .filter(items => !items.completedAt)
    .map(items => formatWorkItem(items, selectedWorkItems));
};
