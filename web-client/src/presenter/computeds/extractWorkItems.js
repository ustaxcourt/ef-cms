import { state } from 'cerebral';

import { formatWorkItem } from './formattedWorkQueue';

export const extractedWorkItems = get => {
  const extractedDocument = get(state.extractedDocument);
  const selectedWorkItems = get(state.selectedWorkItems);
  return (extractedDocument.workItems || [])
    .filter(items => !items.completedAt)
    .map(items => formatWorkItem(items, selectedWorkItems));
};
