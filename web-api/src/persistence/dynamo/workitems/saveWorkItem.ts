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
  const box =
    workItem.inProgress || workItem.caseIsInProgress ? 'inProgress' : 'inbox';

  const gsi2pk =
    !workItem.completedAt && workItem.assigneeId
      ? `assigneeId|${box}|${workItem.assigneeId}`
      : undefined;
  const gsi3pk =
    !workItem.completedAt && workItem.section
      ? `section|${box}|${workItem.section}`
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
