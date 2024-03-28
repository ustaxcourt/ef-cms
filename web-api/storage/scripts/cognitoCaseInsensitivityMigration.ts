import {
  AdminCreateUserCommandInput,
  ListUsersCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { createApplicationContext } from '@web-api/applicationContext';

const applicationContext = createApplicationContext({});
const cognito = applicationContext.getCognito();

async function cognitoCaseInsensitivityMigration({
  destinationUserPool,
  sourceUserPool,
}: {
  destinationUserPool: string;
  sourceUserPool: string;
}): Promise<void> {
  try {
    let paginationToken;
    do {
      const params: ListUsersCommandInput = {
        Limit: 60,
        PaginationToken: paginationToken,
        UserPoolId: sourceUserPool, // source
      };
      const data = await cognito.listUsers(params);

      console.log('batch of users to update', data);

      for (const user of data.Users!) {
        const userEmail = user.Attributes?.find(attr => {
          return attr.Name === 'email';
        })?.Value;

        const adminUpdateUserParams: AdminCreateUserCommandInput = {
          UserAttributes: [...user.Attributes!],
          UserPoolId: destinationUserPool, // destination
          Username: userEmail,
        };

        await cognito.adminCreateUser(adminUpdateUserParams);
      }

      paginationToken = data.PaginationToken;
    } while (paginationToken);

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Error updating users:', error);
  }
}

async function main() {
  await cognitoCaseInsensitivityMigration({
    destinationUserPool: '',
    sourceUserPool: applicationContext.environment.userPoolId,
  });
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
