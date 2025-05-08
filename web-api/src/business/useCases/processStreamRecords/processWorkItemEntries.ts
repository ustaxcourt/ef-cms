import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { compact } from 'lodash';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { upsertWorkItems } from '@web-api/persistence/postgres/workitems/upsertWorkItems';
import type { IDynamoDBRecord } from '@web-api/business/useCases/processStreamRecords/processStreamUtilities';
import type { ServerApplicationContext } from '@web-api/applicationContext';

export const processWorkItemEntries = async ({
  applicationContext,
  workItemRecords,
}: {
  applicationContext: ServerApplicationContext;
  workItemRecords: any[];
}) => {
  if (!workItemRecords.length) return;

  getDawsonLogger().debug(
    `Indexing ${workItemRecords.length} work item records`,
  );

  const indexWorkItemEntry = workItemRecord => {
    const workItemNewImage = workItemRecord.dynamodb.NewImage;

    const caseWorkItemMappingRecordId = `${workItemNewImage.pk.S}_${workItemNewImage.pk.S}|mapping`;

    const caseWorkItemMappingRecord = {
      case_relations: {
        name: 'workItem',
        parent: caseWorkItemMappingRecordId,
      },
    };

    return {
      dynamodb: {
        Keys: {
          pk: {
            S: workItemNewImage.pk.S,
          },
          sk: {
            S: workItemNewImage.sk.S,
          },
        },
        NewImage: {
          ...workItemNewImage,
          ...caseWorkItemMappingRecord,
        },
      },
      eventName: 'MODIFY' as 'MODIFY',
    };
  };

  const indexRecords: IDynamoDBRecord[] =
    workItemRecords.map(indexWorkItemEntry);

  const { failedRecords } = await applicationContext
    .getPersistenceGateway()
    .bulkIndexRecords({
      applicationContext,
      records: compact(indexRecords),
    });

  if (failedRecords.length > 0) {
    getDawsonLogger().error('the records that failed to index', {
      failedRecords,
    });
    throw new Error('failed to index work item records');
  }

  // In Dynamo, we often have multiple copies of a work item with different pks: the "main" record, and outbox records.
  // In SQL, we want only one copy of the work item, and we want that copy to be the "main" copy, not an outbox item.
  const nonOutboxWorkItemRecords = workItemRecords.filter(record =>
    record.dynamodb.NewImage.pk.S.startsWith('case|'),
  );

  getDawsonLogger().debug(
    `Upserting ${nonOutboxWorkItemRecords.length} work item records into postgres`,
  );

  await upsertWorkItems({
    workItems: nonOutboxWorkItemRecords.map(record => {
      return unmarshall(record.dynamodb.NewImage) as RawWorkItem;
    }),
  });
};
