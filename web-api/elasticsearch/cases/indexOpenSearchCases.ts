import { marshall } from '@aws-sdk/util-dynamodb';
import {
  IDynamoDBRecord,
  AttributeValueWithName,
} from '@web-api/business/useCases/processStreamRecords/processStreamUtilities';
import { applicationContext } from '@web-api/applicationContext';
import { OpenSearchSyncMessage } from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { bulkIndexRecords } from '@web-api/persistence/elasticsearch/bulkIndexRecords';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { getCaseMetadataWithCounsel } from '@web-api/persistence/postgres/cases/getCaseMetadataWithCounsel';
import { flattenDeep } from 'lodash';

export const indexOpenSearchCases = async ({
  message,
}: {
  message: OpenSearchSyncMessage;
}): Promise<void> => {
  for (const docketNumber of Array.isArray(message.payload)
    ? message.payload
    : [message.payload]) {
    const caseRecord = await getCaseMetadataWithCounsel({
      applicationContext,
      docketNumber,
    });

    if (!caseRecord) {
      getDawsonLogger().error(
        `Could not index case ${docketNumber}: not found!`,
      );
      continue;
    }

    // Recommend further optimization so we are not mocking a DynamoDB record after cases are in Postgres
    // Just done this way because bulkIndexRecords expects Dynamo records
    const marshalledCase = marshall(
      transformNullToUndefined({
        ...caseRecord,
        pk: `case|${caseRecord.docketNumber}`,
        sk: `case|${caseRecord.docketNumber}`,
        entityName: 'Case',
      }),
      { removeUndefinedValues: true },
    );
    const caseRecords: IDynamoDBRecord[] = [];

    caseRecords.push({
      dynamodb: {
        Keys: {
          pk: {
            S: `case|${caseRecord.docketNumber}`,
          },
          sk: {
            S: `case|${caseRecord.docketNumber}`,
          },
        },
        NewImage: {
          ...marshalledCase,
          case_relations: { name: 'case' },
          entityName: { S: 'CaseDocketEntryMapping' },
        },
      },
      eventName: 'MODIFY',
    });

    caseRecords.push({
      dynamodb: {
        Keys: {
          pk: {
            S: `case|${caseRecord.docketNumber}`,
          },
          sk: {
            S: `case|${caseRecord.docketNumber}`,
          },
        },
        NewImage: marshalledCase as { [key: string]: AttributeValueWithName },
      },
      eventName: 'MODIFY',
    });

    const { failedRecords } = await bulkIndexRecords({
      applicationContext,
      records: flattenDeep(caseRecords),
    });

    if (failedRecords.length > 0) {
      getDawsonLogger().error(
        'the case or docket entry records that failed to index',
        {
          failedRecords,
        },
      );
      throw new Error('failed to index case entry or docket entry records');
    }
  }
};
