import { ServerApplicationContext } from '@web-api/applicationContext';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { processCompletionMarkers } from './processCompletionMarkers';
import type { DynamoDBRecord } from 'aws-lambda';

export const processStreamRecordsInteractor = async (
  applicationContext: ServerApplicationContext,
  { recordsToProcess }: { recordsToProcess: DynamoDBRecord[] },
): Promise<void> => {
  const completionMarkers = recordsToProcess.filter(
    record =>
      record.dynamodb?.NewImage?.entityName &&
      record.dynamodb.NewImage.entityName.S === 'CompletionMarker',
  );

  try {
    await processCompletionMarkers({
      applicationContext,
      completionMarkers,
    });
  } catch (err) {
    getDawsonLogger().error(
      'processStreamRecordsInteractor failed to process the records',
      { err },
    );
    throw err;
  }
};
