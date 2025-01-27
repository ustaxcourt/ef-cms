import { marshall } from '@aws-sdk/util-dynamodb';
import { applicationContext } from '@web-api/applicationContext';
import {
  AttributeValueWithName,
  IDynamoDBRecord,
} from '@web-api/business/useCases/processStreamRecords/processStreamUtilities';
import { getDbReader } from '@web-api/database';
import { OpensearchWorkerMessage } from '@web-api/gateways/opensearch/opensearchWorkerRouter';
import { getLogger } from '@web-api/utilities/logger/getLogger';
import { flattenDeep } from 'lodash';

export const updateCaseWorker = async ({
  message,
}: {
  message: OpensearchWorkerMessage;
}) => {
  console.log('updateCaseWorker', message);

  for (const caseRecord of message.payload) {
    console.log('pre dbPetitionersOnCase');

    const dbPetitionersOnCase = await getDbReader(reader =>
      reader
        .selectFrom('dwPetitionerOnCase')
        .where('docketNumber', '=', caseRecord.docketNumber)
        .orderBy('orderOnCase', 'asc')
        .selectAll()
        .execute(),
    );

    console.log('dbPetitionersOnCase', dbPetitionersOnCase);

    const marshalledCase = marshall({
      pk: `case|${caseRecord.docketNumber}`,
      sk: `case|${caseRecord.docketNumber}`,
      entityName: 'Case',
      caseCaption: caseRecord.caption,
      docketNumber: caseRecord.docketNumber,
      docketNumberWithSuffix:
        caseRecord.docketNumber +
        (caseRecord.docketNumberSuffix ? caseRecord.docketNumberSuffix : ''),
      isSealed: caseRecord.isSealed,
      irsPractitioners: [],
      privatePractitioners: [],
      petitioners: dbPetitionersOnCase || [],
    });
    console.log('marshalledCase', marshalledCase);
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
