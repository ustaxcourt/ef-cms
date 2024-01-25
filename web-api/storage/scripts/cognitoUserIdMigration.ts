import {
  AdminUpdateUserAttributesCommandInput,
  CognitoIdentityProvider,
  ListUsersCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { createApplicationContext } from '@web-api/applicationContext';

const applicationContext = createApplicationContext({});
const cognito = applicationContext.getCognito();
// const cognito = new CognitoIdentityProvider({
//   endpoint: 'http://localhost:9229/',
//   maxAttempts: 3,
//   region: 'local',
// });

async function updateUsersWithMissingAttribute(
  userPoolId: string,
): Promise<void> {
  try {
    let paginationToken;
    do {
      const params: ListUsersCommandInput = {
        Limit: 60,
        PaginationToken: paginationToken,
        UserPoolId: userPoolId,
      };
      const data = await cognito.listUsers(params);
      const usersToUpdate = data.Users.filter(
        user => !user.Attributes?.find(attr => attr.Name === 'custom:userId'),
      );

      console.log('batch of users to update', usersToUpdate);

      for (const user of usersToUpdate) {
        const userEmail = user.Attributes?.find(attr => {
          return attr.Name === 'email';
        })?.Value;
        const userSub = user.Attributes?.find(attr => {
          return attr.Name === 'sub';
        })?.Value;

        const adminUpdateUserParams: AdminUpdateUserAttributesCommandInput = {
          UserAttributes: [
            {
              Name: 'custom:userId',
              Value: userSub,
            },
          ],
          UserPoolId: userPoolId,
          Username: userEmail,
        };

        await cognito.adminUpdateUserAttributes(adminUpdateUserParams);
      }

      paginationToken = data.PaginationToken;
    } while (paginationToken);

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Error updating users:', error);
  }
}

async function main() {
  await updateUsersWithMissingAttribute(
    // 'local_2pHzece7',
    applicationContext.environment.userPoolId,
  );
}

main();
