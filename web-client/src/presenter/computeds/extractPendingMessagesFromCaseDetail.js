import { state } from 'cerebral';

import { formatWorkItem } from './formattedWorkQueue';

export const extractedPendingMessagesFromCaseDetail = get => {
  const caseDetail = get(state.caseDetail);
  const workItems = caseDetail.documents.reduce(
    (acc, document) => [...acc, ...document.workItems],
    [],
  );
  return workItems
    .filter(items => !items.completedAt)
    .map(workItem => formatWorkItem(workItem, []));
};
