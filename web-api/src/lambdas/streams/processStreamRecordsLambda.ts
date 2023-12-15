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
    const {
      ApproximateCreationDateTime,
    }: { ApproximateCreationDateTime?: any } = record.dynamodb;

    let approximateCreationDateTime: number;
    if (ApproximateCreationDateTime instanceof Date) {
      approximateCreationDateTime = Math.floor(
        ApproximateCreationDateTime.getTime() / 1000,
      );
    } else if (typeof ApproximateCreationDateTime === 'number') {
      approximateCreationDateTime = ApproximateCreationDateTime;
    } else {
      applicationContext.logger.error(
        `Error handling stream event timestamp for event ${record.eventID}`,
        { ApproximateCreationDateTime, pk: record.dynamodb.Keys?.pk?.S },
      );
      return true;
    }

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
