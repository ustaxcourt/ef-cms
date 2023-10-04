import {
  batchGet,
  getTableName,
} from '../../persistence/dynamodbClientService';
import { createApplicationContext } from '../../applicationContext';
import type { DynamoDBRecord, DynamoDBStreamEvent } from 'aws-lambda';

/**
 *
 */
async function putEventHistory(
  applicationContext: IApplicationContext,
  eventID: string,
) {
  const twentyFourHours = 24 * 60 * 60 * 1000;

  await applicationContext
    .getDocumentClient({
      useMasterRegion: true,
    })
    .put({
      Item: {
        pk: `stream-event-id|${eventID}`,
        sk: `stream-event-id|${eventID}`,
        ttl: Date.now() + twentyFourHours,
      },
      TableName: getTableName({
        applicationContext,
      }),
    })
    .promise();
}

/**
 *
 */
async function getEventHistories(
  applicationContext: IApplicationContext,
  records: DynamoDBRecord[],
) {
  return (await batchGet({
    applicationContext,
    keys: records
      .map(record => record.eventID)
      .map(eventID => ({
        pk: `stream-event-id|${eventID}`,
        sk: `stream-event-id|${eventID}`,
      })),
  })) as { pk: string; sk: string }[];
}

/**
 * used for processing stream records from persistence
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const processStreamRecordsLambda = async (
  event: DynamoDBStreamEvent,
) => {
  const applicationContext = createApplicationContext({});
  const recordsToProcess: DynamoDBRecord[] = [];

  const isStreamRecord = record =>
    record.dynamodb?.Keys?.pk.S?.startsWith('stream-event-id');

  const recordsToCheck = event.Records.filter(
    record => !isStreamRecord(record),
  );

  const allEventHistories = await getEventHistories(
    applicationContext,
    recordsToCheck,
  );

  await Promise.all(
    recordsToCheck.map(record => {
      const isRecordProcessed = !!allEventHistories.find(
        history => history.pk === `stream-event-id|${record.eventID}`,
      );
      if (!isRecordProcessed) {
        recordsToProcess.push(record);
      }
    }),
  );

  if (recordsToProcess.length > 0) {
    await applicationContext
      .getUseCases()
      .processStreamRecordsInteractor(applicationContext, {
        recordsToProcess,
      });

    await Promise.all(
      recordsToProcess.map(async record => {
        const { eventID } = record;
        if (!eventID) return;
        await putEventHistory(applicationContext, eventID);
      }),
    );
  }
};
