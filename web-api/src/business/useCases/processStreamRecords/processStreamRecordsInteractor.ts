import { ServerApplicationContext } from '@web-api/applicationContext';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { partitionRecords } from './processStreamUtilities';
import { processCompletionMarkers } from './processCompletionMarkers';
import { processDocketEntries } from './processDocketEntries';
import { processOtherEntries } from './processOtherEntries';
import { processPractitionerMappingEntries } from './processPractitionerMappingEntries';
import { processRemoveEntries } from './processRemoveEntries';
import type { DynamoDBRecord } from 'aws-lambda';
import { processUserEntries } from '@web-api/business/useCases/processStreamRecords/processUserEntries';
import { processUserOnCasePendingEntries } from './processUserOnCasePendingEntries';
import { processUserOnCaseEntries } from './processUserOnCaseEntries';

export const processStreamRecordsInteractor = async (
  applicationContext: ServerApplicationContext,
  { recordsToProcess }: { recordsToProcess: DynamoDBRecord[] },
): Promise<void> => {
  const {
    completionMarkers,
    docketEntryRecords,
    otherRecords,
    practitionerMappingRecords,
    removeRecords,
    userOnCasePendingRecords,
    userOnCaseRecords,
    userRecords,
  } = partitionRecords(recordsToProcess);

  try {
    await processRemoveEntries({
      applicationContext,
      removeRecords,
    }).catch(err => {
      getDawsonLogger().error('failed to processRemoveEntries', {
        err,
      });
      throw err;
    });

    await processDocketEntries({
      docketEntryRecords,
    }).catch(err => {
      getDawsonLogger().error('failed to processDocketEntries', {
        err,
      });
      throw err;
    });

    await processPractitionerMappingEntries({
      practitionerMappingRecords,
    }).catch(err => {
      getDawsonLogger().error(
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

    await processUserEntries({ userRecords }).catch(err => {
      getDawsonLogger().error('failed to process user records', {
        err,
      });
      throw err;
    });

    await processUserOnCasePendingEntries({ userOnCasePendingRecords }).catch(
      err => {
        getDawsonLogger().error('failed to processUserOnCasePendingEntries', {
          err,
        });
        throw err;
      },
    );

    await processUserOnCaseEntries({ userOnCaseRecords }).catch(err => {
      getDawsonLogger().error('failed to processUserOnCaseEntries', {
        err,
      });
      throw err;
    });

    await processOtherEntries({ applicationContext, otherRecords }).catch(
      err => {
        getDawsonLogger().error('failed to processOtherEntries', {
          err,
        });
        throw err;
      },
    );
  } catch (err) {
    getDawsonLogger().error(
      'processStreamRecordsInteractor failed to process the records',
      { err },
    );
    throw err;
  }
};
