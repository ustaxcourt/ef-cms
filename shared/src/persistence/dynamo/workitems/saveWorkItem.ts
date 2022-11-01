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
  workItem: WorkItem;
}) =>
  put({
    Item: {
      gsi1pk: `work-item|${workItem.workItemId}`,
      pk: `case|${workItem.docketNumber}`,
      sk: `work-item|${workItem.workItemId}`,
      ...workItem,
    },
    applicationContext,
  });
