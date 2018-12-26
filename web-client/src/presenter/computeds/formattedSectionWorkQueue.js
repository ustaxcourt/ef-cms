import { state } from 'cerebral';

import { formatWorkItem } from './formattedWorkQueue';

export const formattedSectionWorkQueue = get => {
  const workItems = get(state.sectionWorkQueue);
  return workItems.map(formatWorkItem);
};
