import { marshall } from '@aws-sdk/util-dynamodb';
import { Case } from '@shared/business/entities/cases/Case';
import { applicationContext } from '@web-api/applicationContext';
import {
  AttributeValueWithName,
  IDynamoDBRecord,
} from '@web-api/business/useCases/processStreamRecords/processStreamUtilities';
import { OpensearchWorkerMessage } from '@web-api/gateways/opensearch/opensearchWorkerRouter';
import { getPetitionersOnCase } from '@web-api/persistence/postgres/cases/parties/getPetitionersOnCase';
import { getLogger } from '@web-api/utilities/logger/getLogger';
import { flattenDeep, isArray } from 'lodash';

export const opensearchUpdateCaseWorker = async ({
  message,
}: {
  message: OpensearchWorkerMessage;
}): Promise<void> => {
  for (const caseRecord of isArray(message.payload)
    ? message.payload
    : [message.payload]) {
    const petitionersOnCase = await getPetitionersOnCase({
      docketNumber: caseRecord.docketNumber,
    });

    // Recommend further optimization so we are not mocking a DynamoDB record after cases are in Postgres
    const marshalledCase = marshall({
      pk: `case|${caseRecord.docketNumber}`,
      sk: `case|${caseRecord.docketNumber}`,
      entityName: 'Case',
      caseCaption: caseRecord.caption,
      docketNumber: caseRecord.docketNumber,
      docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
        docketNumber: caseRecord.docketNumber,
        docketNumberSuffix: caseRecord.docketNumberSuffix,
      }),
      isSealed: caseRecord.isSealed,
      petitioners: petitionersOnCase || [],
      receivedAt: caseRecord.receivedAt.toISOString(),
    });

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

    const { failedRecords } = await applicationContext
      .getPersistenceGateway()
      .bulkIndexRecords({
        applicationContext,
        records: flattenDeep(caseRecords),
      });

    if (failedRecords.length > 0) {
      getLogger().error(
        'the case or docket entry records that failed to index',
        {
          failedRecords,
        },
      );
      throw new Error('failed to index case entry or docket entry records');
    }
  }
};
