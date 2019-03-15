import _ from 'lodash';
import { formatWorkItem } from './formattedWorkQueue';
import { state } from 'cerebral';

export const extractedPendingMessagesFromCaseDetail = get => {
  const documents = get(state.caseDetail).documents || [];
  const workItems = documents
    .reduce((acc, document) => [...acc, ...(document.workItems || [])], [])
    .filter(items => !items.completedAt)
    .map(workItem => formatWorkItem(workItem, []));
  return _.orderBy(workItems, 'createdAt', 'desc');
};
