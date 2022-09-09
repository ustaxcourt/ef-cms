const { compact } = require('lodash');

exports.processWorkItemEntries = async ({
  applicationContext,
  workItemRecords,
}) => {
  if (!workItemRecords.length) return;

  applicationContext.logger.debug(
    `going to index ${workItemRecords.length} work item records`,
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
      eventName: 'MODIFY',
    };
  };

  const indexRecords = await Promise.all(
    workItemRecords.map(indexWorkItemEntry),
  );

  const { failedRecords } = await applicationContext
    .getPersistenceGateway()
    .bulkIndexRecords({
      applicationContext,
      records: compact(indexRecords),
    });

  if (failedRecords.length > 0) {
    applicationContext.logger.error('the records that failed to index', {
      failedRecords,
    });
    throw new Error('failed to index work item records');
  }
};
