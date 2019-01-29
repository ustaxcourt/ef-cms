import { state } from 'cerebral';

import { formatWorkItem } from './formattedWorkQueue';

export const extractedPendingMessagesFromCaseDetail = get => {
  const documents = get(state.caseDetail).documents || [];
  const workItems = documents.reduce(
    (acc, document) => [...acc, ...(document.workItems || [])],
    [],
  );
  return workItems
    .filter(items => !items.completedAt)
    .map(workItem => formatWorkItem(workItem, []));
};
