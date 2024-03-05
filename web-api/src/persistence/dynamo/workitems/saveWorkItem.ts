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

  const gsiUserBox =
    !workItem.completedAt && workItem.assigneeId
      ? `assigneeId|${box}|${workItem.assigneeId}`
      : undefined;
  const gsiSectionBox =
    !workItem.completedAt && workItem.section
      ? `section|${box}|${workItem.section}`
      : undefined;

  return put({
    Item: {
      gsi1pk: `work-item|${workItem.workItemId}`,
      gsiSectionBox,
      gsiUserBox,
      pk: `case|${workItem.docketNumber}`,
      sk: `work-item|${workItem.workItemId}`,
      ...workItem,
    },
    applicationContext,
  });
};
