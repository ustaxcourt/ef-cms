import { formatWorkItem } from './formattedWorkQueue';
import { state } from 'cerebral';
import _ from 'lodash';

export const extractedPendingMessagesFromCaseDetail = (
  get,
  applicationContext,
) => {
  const documents = get(state.caseDetail).documents || [];
  let workQueue = documents
    .reduce((acc, document) => [...acc, ...(document.workItems || [])], [])
    .filter(items => !items.completedAt)
    .map(workItem => formatWorkItem(applicationContext, workItem))
    .filter(
      workItem => !workItem.currentMessage.message.includes('batched for IRS'),
    );
  workQueue = _.orderBy(workQueue, 'currentMessage.createdAt', 'desc');
  return workQueue;
};
