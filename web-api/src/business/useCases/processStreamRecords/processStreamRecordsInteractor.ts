import { ServerApplicationContext } from '@web-api/applicationContext';
import { getLogger } from '@web-api/utilities/logger/getLogger';
import { partitionRecords } from './processStreamUtilities';
import { processCompletionMarkers } from './processCompletionMarkers';
import { processDocketEntries } from './processDocketEntries';
import { processOtherEntries } from './processOtherEntries';
import { processPractitionerMappingEntries } from './processPractitionerMappingEntries';
import { processRemoveEntries } from './processRemoveEntries';
import type { DynamoDBRecord } from 'aws-lambda';

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
  } = partitionRecords(recordsToProcess);

  try {
    await processRemoveEntries({
      applicationContext,
      removeRecords,
    }).catch(err => {
      getLogger().error('failed to processRemoveEntries', {
        err,
      });
      throw err;
    });

    await processDocketEntries({
      applicationContext,
      docketEntryRecords,
    }).catch(err => {
      getLogger().error('failed to processDocketEntries', {
        err,
      });
      throw err;
    });

    await processPractitionerMappingEntries({
      applicationContext,
      practitionerMappingRecords,
    }).catch(err => {
      getLogger().error('failed to process practitioner mapping records', {
        err,
      });
      throw err;
    });

    await processCompletionMarkers({
      applicationContext,
      completionMarkers,
    });

    await processOtherEntries({ applicationContext, otherRecords }).catch(
      err => {
        getLogger().error('failed to processOtherEntries', {
          err,
        });
        throw err;
      },
    );
  } catch (err) {
    getLogger().error(
      'processStreamRecordsInteractor failed to process the records',
      { err },
    );
    throw err;
  }
};
