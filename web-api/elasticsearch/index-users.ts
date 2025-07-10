import { marshall } from '@aws-sdk/util-dynamodb';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { getSearchClient } from '@web-api/getSearchClient';
import { OpenSearchSyncMessage } from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { getUsersByIds } from '@web-api/persistence/postgres/users/getUsersById';
import { UserKysely } from '@web-api/persistence/postgres/users/schema';
import { efcmsUserIndex } from '../elasticsearch/efcms-user-mappings';

export const transformOpenSearchUser = (
  userData: UserKysely | UserKysely[],
): string[] => {
  const users = Array.isArray(userData) ? userData : [userData];
  return users.map(user => user.userId);
};

export const indexOpenSearchUser = async ({
  message,
}: {
  message: OpenSearchSyncMessage;
}): Promise<void> => {
  const userIds: string[] = message.payload;

  // 1. fetch user from postgres
  const users = await getUsersByIds({
    userIds,
  });

  const practitionerRoles: string[] = [
    ROLES.privatePractitioner,
    ROLES.irsPractitioner,
    ROLES.inactivePractitioner,
  ];

  const practitioners = users.filter(user =>
    practitionerRoles.includes(user.role),
  );

  const practitionerIndexCommands: any[] = [];

  practitioners.forEach(practitioner => {
    const marshalledPractitioner = marshall(
      {
        ...practitioner,
        pk: `user|${practitioner.userId}`,
        sk: `user|${practitioner.userId}`,
      },
      { removeUndefinedValues: true },
    );
    // The OpenSearch bulk API expects an object for the operation followed by an object for what is to be operated on, e.g., [{doThis}, {someDocument}, {doThat}, {anotherDocument}]
    practitionerIndexCommands.push({
      index: {
        _index: efcmsUserIndex,
        _id: `user|${practitioner.userId}_user|${practitioner.userId}`,
      },
    });
    practitionerIndexCommands.push(marshalledPractitioner);
  });

  await getSearchClient().bulk({
    refresh: false,
    body: practitionerIndexCommands,
  });
};
