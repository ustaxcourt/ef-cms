import { ServerApplicationContext } from '@web-api/applicationContext';
import type { AttributeValue, DynamoDBRecord, StreamRecord } from 'aws-lambda';

export const getApproximateCreationDateTime = ({
  applicationContext,
  record,
}: {
  applicationContext: ServerApplicationContext;
  record: DynamoDBRecord;
}): number => {
  let approximateCreationDateTime: number = 0;

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
    }
  }

  return approximateCreationDateTime;
};

export const shouldProcessRecord = ({
  applicationContext,
  deploymentTimestamp,
  record,
}: {
  applicationContext: ServerApplicationContext;
  deploymentTimestamp: number;
  record: DynamoDBRecord;
}): boolean => {
  const approximateCreationDateTime = getApproximateCreationDateTime({
    applicationContext,
    record,
  });
  applicationContext.logger.debug(
    `${
      approximateCreationDateTime === 0 ||
      approximateCreationDateTime >= deploymentTimestamp
        ? 'Indexing'
        : 'Not indexing'
    } record ${record.dynamodb?.Keys?.pk?.S}`,
    { approximateCreationDateTime, deploymentTimestamp, record },
  );
  return (
    approximateCreationDateTime === 0 ||
    approximateCreationDateTime >= deploymentTimestamp
  );
};

export interface AttributeValueWithName extends AttributeValue {
  name?: string | undefined;
}

interface IStreamRecord extends StreamRecord {
  NewImage?: { [key: string]: AttributeValueWithName } | undefined;
}

export interface IDynamoDBRecord extends DynamoDBRecord {
  dynamodb?: IStreamRecord | undefined;
}
