import { approvePendingJob } from '../../../../admin-tools/circleci/circleci-helper';
import { partition } from 'lodash';
import type { DynamoDBRecord } from 'aws-lambda';

const practitionerEntityTypes = ['PrivatePractitioner', 'IrsPractitioner'];
const practitionerSortKeys = ['privatePractitioner', 'irsPractitioner'];

export const partitionRecords = (
  records: DynamoDBRecord[],
): { [key: string]: DynamoDBRecord[] } => {
  const [practitionerMappingRecords, nonPractitionerMappingRecords] = partition(
    records,
    record =>
      isPractitionerMappingRemoveRecord(record) ||
      isPractitionerMappingInsertModifyRecord(record),
  );

  const [removeRecords, insertModifyRecords] = partition(
    nonPractitionerMappingRecords,
    record => record.eventName === 'REMOVE',
  );

  const [docketEntryRecords, nonDocketEntryRecords] = partition(
    insertModifyRecords,
    record =>
      record.dynamodb?.NewImage?.entityName &&
      record.dynamodb.NewImage.entityName.S === 'DocketEntry',
  );

  const [caseEntityRecords, nonCaseEntityRecords] = partition(
    nonDocketEntryRecords,
    record =>
      record.dynamodb?.NewImage?.entityName &&
      record.dynamodb.NewImage.entityName.S === 'Case',
  );

  const [workItemRecords, nonWorkItemRecords] = partition(
    nonCaseEntityRecords,
    record =>
      record.dynamodb?.NewImage?.entityName &&
      record.dynamodb.NewImage.entityName.S === 'WorkItem',
  );

  const [messageRecords, otherRecords] = partition(
    nonWorkItemRecords,
    record =>
      record.dynamodb?.NewImage?.entityName &&
      record.dynamodb.NewImage.entityName.S === 'Message',
  );

  return {
    caseEntityRecords,
    docketEntryRecords,
    messageRecords,
    otherRecords,
    practitionerMappingRecords,
    removeRecords,
    workItemRecords,
  };
};

export const isPractitionerMappingRemoveRecord = (
  record: DynamoDBRecord,
): boolean => {
  const oldImage = record.dynamodb?.OldImage;
  if (oldImage) {
    const trimmedSk = oldImage.sk?.S?.split('|')[0] || undefined;

    return (
      (trimmedSk &&
        record.eventName === 'REMOVE' &&
        oldImage.entityName &&
        oldImage.entityName.S &&
        practitionerEntityTypes.includes(oldImage.entityName.S) &&
        oldImage.pk?.S?.startsWith('case|') &&
        practitionerSortKeys.includes(trimmedSk)) === true
    );
  }

  return false;
};

export const isPractitionerMappingInsertModifyRecord = (
  record: DynamoDBRecord,
): boolean => {
  const newImage = record.dynamodb?.NewImage;

  if (newImage) {
    const trimmedSk = newImage.sk?.S?.split('|')[0] || undefined;

    return (
      (trimmedSk &&
        newImage.entityName &&
        newImage.entityName.S &&
        practitionerEntityTypes.includes(newImage.entityName.S) &&
        newImage.pk?.S?.startsWith('case|') &&
        practitionerSortKeys.includes(trimmedSk)) === true
    );
  }

  return false;
};

export const getApproximateCreationDateTime = ({
  applicationContext,
  record,
}: {
  applicationContext: IApplicationContext;
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
  applicationContext: IApplicationContext;
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

const shouldDetermineIfMigrationWritesAreFinishedIndexing = ({
  migrationBeginTimestamp,
  migrationEndTimestamp,
  migrationWorkflow,
}: {
  migrationBeginTimestamp: number;
  migrationEndTimestamp: number;
  migrationWorkflow: string;
}): boolean => {
  return (
    migrationBeginTimestamp > 0 &&
    migrationEndTimestamp > 0 &&
    migrationBeginTimestamp < migrationEndTimestamp &&
    migrationWorkflow.includes('apiToken') &&
    migrationWorkflow.includes('jobName') &&
    migrationWorkflow.includes('workflowId')
  );
};

const areMigrationWritesFinishedIndexing = ({
  applicationContext,
  lastProcessedRecord,
  migrationBeginTimestamp,
  migrationEndTimestamp,
}: {
  applicationContext: IApplicationContext;
  lastProcessedRecord: DynamoDBRecord;
  migrationBeginTimestamp: number;
  migrationEndTimestamp: number;
}): boolean => {
  const approxCreationOfLastProcessedRecord = getApproximateCreationDateTime({
    applicationContext,
    record: lastProcessedRecord,
  });
  return (
    approxCreationOfLastProcessedRecord > migrationBeginTimestamp &&
    approxCreationOfLastProcessedRecord >= migrationEndTimestamp
  );
};

export const continueDeploymentIfMigrationWritesAreFinishedIndexing = async ({
  applicationContext,
  lastProcessedRecord,
}: {
  applicationContext: IApplicationContext;
  lastProcessedRecord: DynamoDBRecord;
}): Promise<void> => {
  const migrationBeginTimestamp: number =
    Number(process.env.MIGRATION_BEGIN_TIMESTAMP) || 0;
  const migrationEndTimestamp: number =
    Number(process.env.MIGRATION_END_TIMESTAMP) || 0;
  const migrationWorkflow = process.env.MIGRATION_WORKFLOW || '';

  if (
    shouldDetermineIfMigrationWritesAreFinishedIndexing({
      migrationBeginTimestamp,
      migrationEndTimestamp,
      migrationWorkflow,
    }) &&
    areMigrationWritesFinishedIndexing({
      applicationContext,
      lastProcessedRecord,
      migrationBeginTimestamp,
      migrationEndTimestamp,
    })
  ) {
    const { apiToken, jobName, workflowId } = JSON.parse(migrationWorkflow);
    await approvePendingJob({ apiToken, jobName, workflowId });
  }
};
