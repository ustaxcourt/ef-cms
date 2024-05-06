import { DeleteRequest } from '@web-api/persistence/dynamo/dynamoTypes';
import { ListUsersCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import {
  ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { batchWrite } from '@web-api/persistence/dynamodbClientService';
import { environment } from '@web-api/environment';
import { getUserPoolId } from 'shared/admin-tools/util';

const deleteSubUsers = async (
  data: ListUsersCommandOutput,
  applicationContext: ServerApplicationContext,
) => {
  const usersToUpdate =
    data.Users?.map(user => {
      const customUserId = user.Attributes?.find(
        attr => attr.Name === 'custom:userId',
      )?.Value;
      const sub = user.Attributes?.find(attr => attr.Name === 'sub')?.Value;
      const email = user.Attributes?.find(attr => attr.Name === 'email')?.Value;

      return { customUserId, email, sub };
    }).filter(user => {
      return (
        user.sub !== user.customUserId && !!user.customUserId && !!user.sub
      );
    }) || [];

  const deleteRequests: DeleteRequest[] = usersToUpdate.map(user => {
    return {
      DeleteRequest: {
        Key: { pk: `user|${user.sub}`, sk: `user|${user.sub}` },
      },
    };
  });
  await batchWrite(deleteRequests, applicationContext);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});
  const userPoolId = await getUserPoolId();
  environment.userPoolId = userPoolId;

  try {
    let paginationToken;
    let completedUsers = 0;

    do {
      const data = await applicationContext.getCognito().listUsers({
        Limit: 50,
        PaginationToken: paginationToken,
        UserPoolId: applicationContext.environment.userPoolId,
      });

      await deleteSubUsers(data, applicationContext);

      paginationToken = data.PaginationToken;
      completedUsers += 50;

      console.log(
        `********** COMPLETED BATCH, total users migrated ${completedUsers} **********`,
      );
    } while (paginationToken);
  } catch (error) {
    console.error('Error updating users:', error);
  }
})();
