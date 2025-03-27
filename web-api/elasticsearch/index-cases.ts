import { marshall } from '@aws-sdk/util-dynamodb';
import { Case } from '@shared/business/entities/cases/Case';
import {
  IDynamoDBRecord,
  AttributeValueWithName,
} from '@web-api/business/useCases/processStreamRecords/processStreamUtilities';
import { applicationContext } from '@web-api/applicationContext';
import { OpenSearchSyncMessage } from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { getIrsPractitionersOnCase } from '@web-api/persistence/dynamo/practitioners/getIrsPractitionersOnCase';
import { getPrivatePractitionersOnCase } from '@web-api/persistence/dynamo/practitioners/getPrivatePractitionersOnCase';
import { bulkIndexRecords } from '@web-api/persistence/elasticsearch/bulkIndexRecords';
import { getPetitionersOnCase } from '@web-api/persistence/postgres/cases/parties/getPetitionersOnCase';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { getLogger } from 'aws-xray-sdk';
import { pick, mapValues, flattenDeep, isArray } from 'lodash';
import { efcmsCaseMappings } from './efcms-case-mappings';

const FIELDS_THAT_NEED_INDEXING = Object.keys(efcmsCaseMappings.properties).map(
  field => field.split('.')[0],
);

export const filterCaseBeforeSendingThroughQueue = caseData => {
  const cases = isArray(caseData) ? caseData : [caseData];
  return cases.map(c => pick(c, FIELDS_THAT_NEED_INDEXING));
};

export const openSearchIndexCase = async ({
  message,
}: {
  message: OpenSearchSyncMessage;
}): Promise<void> => {
  for (const caseRecord of isArray(message.payload)
    ? message.payload
    : [message.payload]) {
    const petitioners = await getPetitionersOnCase({
      docketNumber: caseRecord.docketNumber,
    });

    // Although we do not search by practitioner, we need this info stored to check permissions on searches
    const privatePractitioners = await getPrivatePractitionersOnCase({
      applicationContext,
      docketNumber: caseRecord.docketNumber,
    });

    const irsPractitioners = await getIrsPractitionersOnCase({
      applicationContext,
      docketNumber: caseRecord.docketNumber,
    });

    // Recommend further optimization so we are not mocking a DynamoDB record after cases are in Postgres
    const marshalledCase = marshall(
      transformNullToUndefined({
        ...mapValues(
          {
            ...pick(caseRecord, FIELDS_THAT_NEED_INDEXING),
            privatePractitioners,
            irsPractitioners,
          },
          value => (value instanceof Date ? value.toISOString() : value),
        ),
        pk: `case|${caseRecord.docketNumber}`,
        sk: `case|${caseRecord.docketNumber}`,
        entityName: 'Case',
        docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
          docketNumber: caseRecord.docketNumber,
          docketNumberSuffix: caseRecord.docketNumberSuffix,
        }),
        petitioners: petitioners || [],
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
