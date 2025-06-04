import { marshall } from '@aws-sdk/util-dynamodb';
import {
  IDynamoDBRecord,
  AttributeValueWithName,
} from '@web-api/business/useCases/processStreamRecords/processStreamUtilities';
import { applicationContext } from '@web-api/applicationContext';
import { OpenSearchSyncMessage } from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { getLogger } from 'aws-xray-sdk';
import { flattenDeep, isArray } from 'lodash';
import { UserKysely } from '@web-api/persistence/postgres/users/schema';
import { bulkIndexRecords } from '@web-api/persistence/elasticsearch/bulkIndexRecords';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { getUserByIdWithPractitioner } from '@web-api/persistence/postgres/users/getUserByIdWithPractitioner';

export const transformOpenSearchUser = (
  userData: UserKysely | UserKysely[],
) => {
  const users = isArray(userData) ? userData : [userData];
  return users.map(user => user.userId);
};

export const indexOpenSearchUser = async ({
  message,
}: {
  message: OpenSearchSyncMessage;
}): Promise<void> => {
  for (const userId of isArray(message.payload)
    ? message.payload
    : [message.payload]) {
    const userRecord = await getUserByIdWithPractitioner({ userId });

    if (!userRecord) {
      getLogger().error(`Could not index user ${userId}: not found!`);
      continue;
    }

    let entityName = 'User';
    if (
      userRecord.role === ROLES.irsPractitioner ||
      userRecord.role === ROLES.privatePractitioner ||
      userRecord.role === ROLES.inactivePractitioner
    ) {
      entityName = 'Practitioner';
    }

    // Recommend further optimization so we are not mocking a DynamoDB record after cases are in Postgres
    // Just done this way because bulkIndexRecords expects Dynamo records

    const marshalledUser = marshall(
      {
        ...userRecord,
        pk: `user|${userRecord.userId}`,
        sk: `user|${userRecord.userId}`,
        entityName,
      },
      { removeUndefinedValues: true },
    );

    const userRecords: IDynamoDBRecord[] = [];

    userRecords.push({
      dynamodb: {
        Keys: {
          pk: {
            S: `user|${userRecord.userId}`,
          },
          sk: {
            S: `user|${userRecord.userId}`,
          },
        },
        NewImage: {
          ...marshalledUser,
          case_relations: { name: 'case' },
          entityName: { S: 'CaseDocketEntryMapping' },
        },
      },
      eventName: 'MODIFY',
    });

    userRecords.push({
      dynamodb: {
        Keys: {
          pk: {
            S: `user|${userRecord.userId}`,
          },
          sk: {
            S: `user|${userRecord.userId}`,
          },
        },
        NewImage: marshalledUser as { [key: string]: AttributeValueWithName },
      },
      eventName: 'MODIFY',
    });

    const { failedRecords } = await bulkIndexRecords({
      applicationContext,
      records: flattenDeep(userRecords),
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
