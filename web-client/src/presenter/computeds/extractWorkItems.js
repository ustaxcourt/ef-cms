import { state } from 'cerebral';

import { formatWorkItem } from './formattedWorkQueue';

export const extractedWorkItems = get => {
  const extractedDocument = get(state.extractedDocument);
  return extractedDocument.workItems.map(formatWorkItem);
};
