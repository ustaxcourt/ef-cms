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
}) =>
  put({
    Item: {
      gsi1pk: `work-item|${workItem.workItemId}`,
      gsi2pk:
        workItem.assigneeId && !workItem.completedAt
          ? `assigneeId|${workItem.assigneeId}`
          : undefined,
      gsi3pk:
        !workItem.completedAt && workItem.section
          ? `work-item|${workItem.section}|${
              workItem.inProgress ? 'in-progress' : 'inbox' // docket|in-progress vs work-item|docket|in-progress
            }`
          : undefined,
      pk: `case|${workItem.docketNumber}`,
      sk: `work-item|${workItem.workItemId}`,
      ...workItem,
    },
    applicationContext,
  });
