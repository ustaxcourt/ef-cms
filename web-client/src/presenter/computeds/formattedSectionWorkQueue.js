import { state } from 'cerebral';

import { formatWorkItem } from './formattedWorkQueue';

export const formattedSectionWorkQueue = get => {
  const workItems = get(state.sectionWorkQueue);
  const selectedWorkItems = get(state.selectedWorkItems);
  return workItems.map(items => formatWorkItem(items, selectedWorkItems));
};
