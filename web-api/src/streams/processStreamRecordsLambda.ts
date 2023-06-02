import { createApplicationContext } from '../applicationContext';
import { getTableName } from '../../../shared/src/persistence/dynamodbClientService';
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
async function hasRecordBeenProcessed(
  applicationContext: IApplicationContext,
  record: DynamoDBRecord,
) {
  const { eventID } = record;
  if (!eventID) return false;

  const { Item: eventHistory } = await applicationContext
    .getDocumentClient({
      useMasterRegion: true,
    })
    .get({
      Key: {
        pk: `stream-event-id|${eventID}`,
        sk: `stream-event-id|${eventID}`,
      },
      TableName: getTableName({
        applicationContext,
      }),
    })
    .promise();

  return !!eventHistory;
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

  await Promise.all(
    event.Records.filter(record => !isStreamRecord(record)).map(
      async record => {
        const isRecordProcessed = await hasRecordBeenProcessed(
          applicationContext,
          record,
        );
        if (!isRecordProcessed) {
          recordsToProcess.push(record);
        }
      },
    ),
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
