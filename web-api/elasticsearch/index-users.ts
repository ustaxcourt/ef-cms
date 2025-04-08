import { marshall } from '@aws-sdk/util-dynamodb';
import {
  IDynamoDBRecord,
  AttributeValueWithName,
} from '@web-api/business/useCases/processStreamRecords/processStreamUtilities';
// import { applicationContext } from '@web-api/applicationContext';
import { OpenSearchSyncMessage } from '@web-api/lambdas/openSearch/openSearchSyncHandler';
// import { bulkIndexRecords } from '@web-api/persistence/elasticsearch/bulkIndexRecords';
// import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { getLogger } from 'aws-xray-sdk';
import { isArray } from 'lodash';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { pinkLog } from '@shared/tools/pinkLog';
import { UserKysely } from '@web-api/persistence/postgres/users/schema';

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
    pinkLog('userId', userId);
    const userRecord = await getUserById({ userId });
    pinkLog('userRecord', userRecord);

    if (!userRecord) {
      getLogger().error(`Could not index user ${userId}: not found!`);
      continue;
    }

    //pretend that's dynanodb records

    // Recommend further optimization so we are not mocking a DynamoDB record after cases are in Postgres
    // Just done this way because bulkIndexRecords expects Dynamo records
    const marshalledUser = marshall(
      {
        ...userRecord,
        pk: `user|${userRecord.userId}`,
        sk: `user|${userRecord.userId}`,
        entityName: 'User',
      },
      { removeUndefinedValues: true },
    );

    pinkLog('marshalledUser', marshalledUser);

    const userRecords: IDynamoDBRecord[] = [];

    // put array of the dynamo records into objecy

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

    // put this object of dynamo into opensearch (indexing)

    // const { failedRecords } = await bulkIndexRecords({
    //   applicationContext,
    //   records: flattenDeep(caseRecords),
    // });

    // if (failedRecords.length > 0) {
    //   getLogger().error(
    //     'the case or docket entry records that failed to index',
    //     {
    //       failedRecords,
    //     },
    //   );
    //   throw new Error('failed to index case entry or docket entry records');
    // }
  }
};
