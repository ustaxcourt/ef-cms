import { IDynamoDBRecord } from 'types/IDynamoDBRecord';
import { flattenDeep } from 'lodash';
import { marshall } from '@aws-sdk/util-dynamodb';

/**
 * fetches the latest version of the case from dynamodb and re-indexes all of the docket-entries associated with the case.
 *
 * @param {array} caseEntityRecords all of the event stream records associated with case entities
 */
export const processCaseEntries = async ({
  applicationContext,
  caseEntityRecords,
}: {
  applicationContext: IApplicationContext;
  caseEntityRecords: any[];
}) => {
  if (!caseEntityRecords.length) return;

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
        NewImage: marshalledCase,
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

  if (failedRecords.length > 0) {
    applicationContext.logger.error(
      'the case or docket entry records that failed to index',
      { failedRecords },
    );
    throw new Error('failed to index case entry or docket entry records');
  }
};
