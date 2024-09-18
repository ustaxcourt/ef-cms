import { flattenDeep } from 'lodash';
import { marshall } from '@aws-sdk/util-dynamodb';
import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';
import type {
  AttributeValueWithName,
  IDynamoDBRecord,
} from '@web-api/business/useCases/processStreamRecords/processStreamUtilities';
import type { ServerApplicationContext } from '@web-api/applicationContext';

export const processCaseEntries = async ({
  applicationContext,
  caseEntityRecords,
}: {
  applicationContext: ServerApplicationContext;
  caseEntityRecords: any[];
}) => {
  if (!caseEntityRecords.length) return;

  const casesToUpsert: RawCase[] = [];

  const indexCaseEntry = async caseRecord => {
    const caseNewImage = caseRecord.dynamodb.NewImage;
    const caseRecords: IDynamoDBRecord[] = [];

    const caseMetadataWithCounsel = await applicationContext
      .getPersistenceGateway()
      .getCaseMetadataWithCounsel({
        applicationContext,
        docketNumber: caseNewImage.docketNumber.S,
      });

    const marshalledCase = marshall(caseMetadataWithCounsel);

    casesToUpsert.push(caseMetadataWithCounsel);

    caseRecords.push({
      dynamodb: {
        Keys: {
          pk: {
            S: caseNewImage.pk.S,
          },
          sk: {
            S: `${caseNewImage.sk.S}`,
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
            S: caseNewImage.pk.S,
          },
          sk: {
            S: `${caseNewImage.sk.S}`,
          },
        },
        NewImage: {
          ...marshalledCase,
          case_relations: { name: 'case' },
          entityName: { S: 'CaseMessageMapping' },
        },
      },
      eventName: 'MODIFY',
    });

    caseRecords.push({
      dynamodb: {
        Keys: {
          pk: {
            S: caseNewImage.pk.S,
          },
          sk: {
            S: `${caseNewImage.sk.S}`,
          },
        },
        NewImage: {
          ...marshalledCase,
          case_relations: { name: 'case' },
          entityName: { S: 'CaseWorkItemMapping' },
        },
      },
      eventName: 'MODIFY',
    });

    caseRecords.push({
      dynamodb: {
        Keys: {
          pk: {
            S: caseNewImage.pk.S,
          },
          sk: {
            S: caseNewImage.sk.S,
          },
        },
        NewImage: marshalledCase as { [key: string]: AttributeValueWithName },
      },
      eventName: 'MODIFY',
    });

    return caseRecords;
  };

  const indexRecords = await Promise.all(caseEntityRecords.map(indexCaseEntry));

  const { failedRecords } = await applicationContext
    .getPersistenceGateway()
    .bulkIndexRecords({
      applicationContext,
      records: flattenDeep(indexRecords),
    });

  await upsertCases(casesToUpsert);

  if (failedRecords.length > 0) {
    applicationContext.logger.error(
      'the case or docket entry records that failed to index',
      { failedRecords },
    );
    throw new Error('failed to index case entry or docket entry records');
  }
};
