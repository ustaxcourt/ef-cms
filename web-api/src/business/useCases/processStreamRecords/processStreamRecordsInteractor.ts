import { partitionRecords } from '../../../../../shared/src/business/useCases/processStreamRecords/processStreamUtilities';
import { processCaseEntries } from '../../../../../shared/src/business/useCases/processStreamRecords/processCaseEntries';
import { processCompletionMarkers } from '../../../../../shared/src/business/useCases/processStreamRecords/processCompletionMarkers';
import { processDocketEntries } from '../../../../../shared/src/business/useCases/processStreamRecords/processDocketEntries';
import { processMessageEntries } from '../../../../../shared/src/business/useCases/processStreamRecords/processMessageEntries';
import { processOtherEntries } from '../../../../../shared/src/business/useCases/processStreamRecords/processOtherEntries';
import { processPractitionerMappingEntries } from '../../../../../shared/src/business/useCases/processStreamRecords/processPractitionerMappingEntries';
import { processRemoveEntries } from '../../../../../shared/src/business/useCases/processStreamRecords/processRemoveEntries';
import { processWorkItemEntries } from '../../../../../shared/src/business/useCases/processStreamRecords/processWorkItemEntries';
import type { DynamoDBRecord } from 'aws-lambda';

export const processStreamRecordsInteractor = async (
  applicationContext: IApplicationContext,
  { recordsToProcess }: { recordsToProcess: DynamoDBRecord[] },
): Promise<void> => {
  const {
    caseEntityRecords,
    completionMarkers,
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

    await processCompletionMarkers({
      applicationContext,
      completionMarkers,
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
};
