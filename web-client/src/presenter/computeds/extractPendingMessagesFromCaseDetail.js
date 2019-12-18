import { formatWorkItem } from './formattedWorkQueue';
import { orderBy } from 'lodash';
import { state } from 'cerebral';

export const extractedPendingMessagesFromCaseDetail = (
  get,
  applicationContext,
) => {
  const documents = get(state.caseDetail).documents || [];
  let workQueue = documents
    .reduce((acc, document) => [...acc, ...(document.workItems || [])], [])
    .filter(items => !items.completedAt)
    .map(workItem => formatWorkItem({ applicationContext, workItem }))
    .filter(
      workItem => !workItem.currentMessage.message.includes('batched for IRS'),
    )
    .filter(workItem => !workItem.hideFromPendingMessages);
  workQueue = orderBy(workQueue, 'currentMessage.createdAt', 'desc');
  return workQueue;
};
