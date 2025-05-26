import { ServerApplicationContext } from '@web-api/applicationContext';
import { getLogger } from '@web-api/utilities/logger/getLogger';
import { partitionRecords } from './processStreamUtilities';
import { processCaseCorrespondenceEntries } from '@web-api/business/useCases/processStreamRecords/processCaseCorrespondenceEntries';
import { processCaseDeadlineEntries } from '@web-api/business/useCases/processStreamRecords/processCaseDeadlineEntries';
import { processCaseEntries } from './processCaseEntries';
import { processCaseWorksheetEntries } from '@web-api/business/useCases/processStreamRecords/processCaseWorksheetEntries';
import { processCompletionMarkers } from './processCompletionMarkers';
import { processDocketEntries } from './processDocketEntries';
import { processMessageEntries } from './processMessageEntries';
import { processOtherEntries } from './processOtherEntries';
import { processPractitionerMappingEntries } from './processPractitionerMappingEntries';
import { processRemoveEntries } from './processRemoveEntries';
import { processUserCaseNoteEntries } from '@web-api/business/useCases/processStreamRecords/processUserCaseNoteEntries';
import { processWorkItemEntries } from './processWorkItemEntries';
import type { DynamoDBRecord } from 'aws-lambda';
import { processDocketEntryWorksheetEntries } from '@web-api/business/useCases/processStreamRecords/processDocketEntryWorksheetEntries';

export const processStreamRecordsInteractor = async (
  applicationContext: ServerApplicationContext,
  { recordsToProcess }: { recordsToProcess: DynamoDBRecord[] },
): Promise<void> => {
  const {
    caseCorrespondenceRecords,
    caseDeadlineRecords,
    caseEntityRecords,
    caseWorksheetRecords,
    completionMarkers,
    docketEntryRecords,
    docketEntryWorksheetRecords,
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
      getLogger().error('failed to processRemoveEntries', {
        err,
      });
      throw err;
    });

    await processCaseEntries({
      caseEntityRecords,
    }).catch(err => {
      getLogger().error('failed to processCaseEntries', {
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

    await processDocketEntryWorksheetEntries({
      docketEntryWorksheetRecords,
    }).catch(err => {
      getLogger().error('failed to process DocketEntryWorksheet entries', {
        err,
      });
      throw err;
    });

    await processWorkItemEntries({ applicationContext, workItemRecords }).catch(
      err => {
        getLogger().error('failed to process workItem records', {
          err,
        });
        throw err;
      },
    );

    await processMessageEntries({
      messageRecords,
    }).catch(err => {
      getLogger().error('failed to process message records', {
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
      getLogger().error('failed to process practitioner mapping records', {
        err,
      });
      throw err;
    });

    await processCompletionMarkers({
      applicationContext,
      completionMarkers,
    });

    await processCaseDeadlineEntries({
      caseDeadlineRecords,
    }).catch(err => {
      getLogger().error('failed to process case deadline records', {
        err,
      });
      throw err;
    });

    await processCaseWorksheetEntries({
      caseWorksheetRecords,
    }).catch(err => {
      getLogger().error('failed to process case correspondence records', {
        err,
      });
      throw err;
    });

    await processCaseCorrespondenceEntries({
      caseCorrespondenceRecords,
    }).catch(err => {
      getLogger().error('failed to process case correspondence records', {
        err,
      });
      throw err;
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
