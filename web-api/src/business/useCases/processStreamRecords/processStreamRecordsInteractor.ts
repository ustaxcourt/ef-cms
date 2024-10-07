import { ServerApplicationContext } from '@web-api/applicationContext';
import { partitionRecords } from './processStreamUtilities';
import { processCaseEntries } from './processCaseEntries';
import { processCompletionMarkers } from './processCompletionMarkers';
import { processDocketEntries } from './processDocketEntries';
import { processMessageEntries } from './processMessageEntries';
import { processOtherEntries } from './processOtherEntries';
import { processPractitionerMappingEntries } from './processPractitionerMappingEntries';
import { processRemoveEntries } from './processRemoveEntries';
import { processUserCaseNoteEntries } from '@web-api/business/useCases/processStreamRecords/processUserCaseNoteEntries';
import { processWorkItemEntries } from './processWorkItemEntries';
import type { DynamoDBRecord } from 'aws-lambda';

export const processStreamRecordsInteractor = async (
  applicationContext: ServerApplicationContext,
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
    userCaseNoteRecords,
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

    await processUserCaseNoteEntries({
      applicationContext,
      userCaseNoteRecords,
    }).catch(err => {
      applicationContext.logger.error(
        'failed to process userCaseNote records',
        {
          err,
        },
      );
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
