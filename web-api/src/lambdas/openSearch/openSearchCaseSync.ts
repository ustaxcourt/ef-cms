import { applicationContext } from '@web-api/applicationContext';
import {
  AttributeValueWithName,
  IDynamoDBRecord,
} from '@web-api/business/useCases/processStreamRecords/processStreamUtilities';
import { OpenSearchSyncMessage } from '@web-api/gateways/openSearch/openSearchSyncRouter';
import { getIrsPractitionersOnCase } from '@web-api/persistence/dynamo/practitioners/getIrsPractitionersOnCase';
import { getPrivatePractitionersOnCase } from '@web-api/persistence/dynamo/practitioners/getPrivatePractitionersOnCase';
import { bulkIndexRecords } from '@web-api/persistence/elasticsearch/bulkIndexRecords';
import { indexCaseEntity } from '@web-api/persistence/postgres/cases/mapper';
import { getPetitionersOnCase } from '@web-api/persistence/postgres/cases/parties/getPetitionersOnCase';
import { getLogger } from '@web-api/utilities/logger/getLogger';
import { flattenDeep, isArray } from 'lodash';

export const openSearchCaseSync = async ({
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
    const marshalledCase = indexCaseEntity({
      caseRecord,
      privatePractitioners,
      irsPractitioners,
      petitioners,
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
