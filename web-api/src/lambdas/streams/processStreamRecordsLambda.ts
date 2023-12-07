import { createApplicationContext } from '../../applicationContext';
import type { DynamoDBRecord, DynamoDBStreamEvent } from 'aws-lambda';

export const processStreamRecordsLambda = async (
  event: DynamoDBStreamEvent,
) => {
  const applicationContext = createApplicationContext({});
  const deployedTimestamp: number = 1701790000; // Number(process.env.DEPLOYED_TIMESTAMP!);

  const shouldProcessRecord = (record: DynamoDBRecord): boolean => {
    if (
      'dynamodb' in record &&
      record.dynamodb &&
      'ApproximateCreationDateTime' in record.dynamodb &&
      typeof record.dynamodb.ApproximateCreationDateTime !== 'undefined'
    ) {
      const approximateCreationDateTime: any = record.dynamodb
        .ApproximateCreationDateTime as any;
      const streamCreationTime: number =
        approximateCreationDateTime instanceof Date
          ? Math.floor(approximateCreationDateTime.getTime() / 1000)
          : Number(record.dynamodb.ApproximateCreationDateTime);
      applicationContext.logger.info(
        `stream event was created at ${record.dynamodb.ApproximateCreationDateTime}`,
        {
          ApproximateCreationDateTime:
            record.dynamodb.ApproximateCreationDateTime,
          ApproximateCreationSeconds: streamCreationTime,
          IsDate: approximateCreationDateTime instanceof Date,
          IsSeconds: streamCreationTime < 1800000000,
          StreamRecord: record.dynamodb,
        },
      );
      return streamCreationTime >= deployedTimestamp;
    }
    return true;
  };

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
