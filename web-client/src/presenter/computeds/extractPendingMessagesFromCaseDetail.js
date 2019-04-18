import { formatWorkItem } from './formattedWorkQueue';
import { state } from 'cerebral';
import _ from 'lodash';

export const extractedPendingMessagesFromCaseDetail = get => {
  const documents = get(state.caseDetail).documents || [];
  let workQueue = documents
    .reduce((acc, document) => [...acc, ...(document.workItems || [])], [])
    .filter(items => !items.completedAt)
    .map(workItem => formatWorkItem(workItem, []))
    .filter(
      workItem =>
        workItem.currentMessage.message.indexOf('batched for IRS') === -1,
    );
  workQueue = _.orderBy(workQueue, 'currentMessage.createdAt', 'desc');
  return workQueue;
};
