import { shouldProcessRecord } from '@web-api/business/useCases/processStreamRecords/processStreamUtilities';
import type { DynamoDBRecord, DynamoDBStreamEvent } from 'aws-lambda';

const deploymentTimestamp: number =
  Number(process.env.DEPLOYMENT_TIMESTAMP!) || 0; // epoch seconds

export const processStreamRecordsLambda = async (
  event: DynamoDBStreamEvent,
) => {
  const recordsToProcess: DynamoDBRecord[] = event.Records.filter(record =>
    shouldProcessRecord({ applicationContext, deploymentTimestamp, record }),
  );

  if (recordsToProcess.length > 0) {
    await applicationContext
      .getUseCases()
      .processStreamRecordsInteractor(applicationContext, { recordsToProcess });
  }
};
