import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { put } from '../../dynamodbClientService';

/**
 * saveWorkItem
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.workItem the work item data
 * @returns {Promise} resolves upon completion of persistence request
 */
export const saveWorkItem = ({
  applicationContext,
  workItem,
}: {
  applicationContext: IApplicationContext;
  workItem: RawWorkItem;
}) => {
  // seems like we were trying to separate these on the backend?
  const inboxType = workItem.inProgress ? 'in-progress' : 'inbox';
  const gsi2pk =
    workItem.assigneeId && !workItem.completedAt
      ? `assigneeId|${inboxType}|${workItem.assigneeId}` // e.g., assigneeId|UUID|in-progress
      : undefined;
  const gsi3pk =
    workItem.section && !workItem.completedAt
      ? `section|${inboxType}|${workItem.section}` // e.g., section|petitions|inbox
      : undefined;
  return put({
    Item: {
      gsi1pk: `work-item|${workItem.workItemId}`,
      gsi2pk,
      gsi3pk,
      pk: `case|${workItem.docketNumber}`,
      sk: `work-item|${workItem.workItemId}`,
      ...workItem,
    },
    applicationContext,
  });
};

// sk: work-item|<PRIORITY>|<FILEDDATE>|<WorkItemId>
