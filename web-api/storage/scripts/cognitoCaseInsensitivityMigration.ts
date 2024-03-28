import {
  AdminCreateUserCommandInput,
  AttributeType,
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
        let customUserId,
          userSub,
          userEmail = '';
        let userAttributes: AttributeType[] = [];

        for (const attr of user.Attributes!) {
          //extract email, sub, and custom:userId
          if (attr.Name === 'email') {
            userEmail = attr.Value!;
          }

          if (attr.Name === 'sub') {
            userSub = attr.Value!;
          }

          if (attr.Name === 'custom:userId') {
            customUserId = attr.Value!;
          }

          //filter out sub as cannot set
          if (attr.Name !== 'sub') {
            userAttributes.push(attr);
          }
        }

        //if no custom:userId create one
        if (customUserId === undefined) {
          customUserId = userSub;
        }

        const adminUpdateUserParams: AdminCreateUserCommandInput = {
          UserAttributes: [...userAttributes!],
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
    destinationUserPool: 'us-east-1_wHalQIjdG',
    sourceUserPool: applicationContext.environment.userPoolId,
  });
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
