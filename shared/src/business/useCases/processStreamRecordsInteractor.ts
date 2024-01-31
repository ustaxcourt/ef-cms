import {
  continueDeploymentIfMigrationWritesAreFinishedIndexing,
  partitionRecords,
} from './processStreamRecords/processStreamUtilities';
import { processCaseEntries } from './processStreamRecords/processCaseEntries';
import { processDocketEntries } from './processStreamRecords/processDocketEntries';
import { processMessageEntries } from './processStreamRecords/processMessageEntries';
import { processOtherEntries } from './processStreamRecords/processOtherEntries';
import { processPractitionerMappingEntries } from './processStreamRecords/processPractitionerMappingEntries';
import { processRemoveEntries } from './processStreamRecords/processRemoveEntries';
import { processWorkItemEntries } from './processStreamRecords/processWorkItemEntries';
import type { DynamoDBRecord } from 'aws-lambda';

export const processStreamRecordsInteractor = async (
  applicationContext: IApplicationContext,
  { recordsToProcess }: { recordsToProcess: DynamoDBRecord[] },
): Promise<void> => {
  const {
    caseEntityRecords,
    docketEntryRecords,
    messageRecords,
    otherRecords,
    practitionerMappingRecords,
    removeRecords,
    workItemRecords,
  } = partitionRecords(recordsToProcess);

  try {
    await processRemoveEntries({
      applicationContext,
      removeRecords,
    }).catch(err => {
      applicationContext.logger.error('failed to processRemoveEntries', {
        err,
      });
      throw err;
    });

    await processCaseEntries({
      applicationContext,
      caseEntityRecords,
    }).catch(err => {
      applicationContext.logger.error('failed to processCaseEntries', {
        err,
      });
      throw err;
    });

    await processDocketEntries({
      applicationContext,
      docketEntryRecords,
    }).catch(err => {
      applicationContext.logger.error('failed to processDocketEntries', {
        err,
      });
      throw err;
    });

    await processWorkItemEntries({ applicationContext, workItemRecords }).catch(
      err => {
        applicationContext.logger.error('failed to process workItem records', {
          err,
        });
        throw err;
      },
    );

    await processMessageEntries({
      applicationContext,
      messageRecords,
    }).catch(err => {
      applicationContext.logger.error('failed to process message records', {
        err,
      });
      throw err;
    });

    await processPractitionerMappingEntries({
      applicationContext,
      practitionerMappingRecords,
    }).catch(err => {
      applicationContext.logger.error(
        'failed to process practitioner mapping records',
        {
          err,
        },
      );
      throw err;
    });

    await processOtherEntries({ applicationContext, otherRecords }).catch(
      err => {
        applicationContext.logger.error('failed to processOtherEntries', {
          err,
        });
        throw err;
      },
    );
  } catch (err) {
    applicationContext.logger.error(
      'processStreamRecordsInteractor failed to process the records',
      { err },
    );
    throw err;
  }

  const lastProcessedRecord =
    recordsToProcess[recordsToProcess.length - 1] || {};
  await continueDeploymentIfMigrationWritesAreFinishedIndexing({
    applicationContext,
    lastProcessedRecord,
  });
};
