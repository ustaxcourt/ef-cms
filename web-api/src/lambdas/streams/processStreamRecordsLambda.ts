import { createApplicationContext } from '../../applicationContext';
import type { DynamoDBRecord, DynamoDBStreamEvent } from 'aws-lambda';

const applicationContext = createApplicationContext({});
const deploymentTimestamp: number =
  Number(process.env.DEPLOYMENT_TIMESTAMP!) || 0; // epoch seconds

const shouldProcessRecord = (record: DynamoDBRecord): boolean => {
  if (
    record &&
    'dynamodb' in record &&
    record.dynamodb &&
    'ApproximateCreationDateTime' in record.dynamodb &&
    typeof record.dynamodb.ApproximateCreationDateTime !== 'undefined'
  ) {
    // StreamRecord objects from local dynamodb have an ApproximateCreationDateTime with a type of Date
    // StreamRecord objects from AWS dynamodb have an ApproximateCreationDateTime with a type of number (epoch seconds)
    // here we'll handle both types and convert to epoch seconds if necessary
    const approximateCreationDateTime: number =
      Number(record.dynamodb.ApproximateCreationDateTime) > 9999999999
        ? Math.floor(Number(record.dynamodb.ApproximateCreationDateTime) / 1000)
        : Number(record.dynamodb.ApproximateCreationDateTime);
    applicationContext.logger.debug(
      `${
        approximateCreationDateTime >= deploymentTimestamp
          ? 'Indexing'
          : 'Not indexing'
      } record ${record.dynamodb.Keys?.pk?.S}`,
      { approximateCreationDateTime, deploymentTimestamp },
    );
    return approximateCreationDateTime >= deploymentTimestamp;
  }
  return true;
};

export const processStreamRecordsLambda = async (
  event: DynamoDBStreamEvent,
) => {
  const recordsToProcess: DynamoDBRecord[] = event.Records.filter(record =>
    shouldProcessRecord(record),
  );

  if (recordsToProcess.length > 0) {
    await applicationContext
      .getUseCases()
      .processStreamRecordsInteractor(applicationContext, {
        recordsToProcess,
      });
  }
};
