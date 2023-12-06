import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { createSectionOutboxRecords } from './createSectionOutboxRecords';
import { createUserOutboxRecord } from './createUserOutboxRecord';
import { put } from '../../dynamodbClientService';

/**
 * saveWorkItemForDocketClerkFilingExternalDocument
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.workItem the work item data
 * @returns {Promise} resolves upon completion of persistence requests
 */
export const saveWorkItemForDocketClerkFilingExternalDocument = ({
  applicationContext,
  workItem,
}: {
  applicationContext: IApplicationContext;
  workItem: RawWorkItem;
}) =>
  Promise.all([
    createSectionOutboxRecords({
      applicationContext,
      section: workItem.section,
      workItem,
    }),
    createUserOutboxRecord({
      applicationContext,
      userId: workItem.assigneeId,
      workItem,
    }),
    put({
      Item: {
        ...workItem,
        gsi1pk: `work-item|${workItem.workItemId}`,
        pk: `case|${workItem.docketNumber}`,
        sk: `work-item|${workItem.workItemId}`,
      },
      applicationContext,
    }),
  ]);
