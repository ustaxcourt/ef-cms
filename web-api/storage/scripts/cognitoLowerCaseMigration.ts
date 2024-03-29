import { AdminUpdateUserAttributesCommandInput } from '@aws-sdk/client-cognito-identity-provider';
import { createApplicationContext } from '@web-api/applicationContext';

const applicationContext = createApplicationContext({});
const cognito = applicationContext.getCognito();

async function cognitoLowerCaseMigration({
  userPoolId,
}: {
  userPoolId: string;
}): Promise<void> {
  try {
    let paginationToken;
    do {
      // const params: ListUsersCommandInput = {
      //   Limit: 60,
      //   PaginationToken: paginationToken,
      //   UserPoolId: userPoolId,
      // };
      // const data = await cognito.listUsers(params);

      const data = await cognito.listUsers({
        Filter: 'email = "kswann+DemoCase@flexion.us"',
        UserPoolId: applicationContext.environment.userPoolId,
      });

      console.log('batch of users to update', data);

      for (const user of data.Users!) {
        let customUserId,
          userSub,
          userEmail = '';

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
        }

        //if no custom:userId create one
        if (customUserId === undefined) {
          customUserId = userSub;
        }

        const adminUpdateUserParams: AdminUpdateUserAttributesCommandInput = {
          UserAttributes: [
            {
              Name: 'email',
              Value: userEmail.toLowerCase(),
            },
            {
              Name: 'custom:userId',
              Value: customUserId,
            },
            {
              Name: 'email_verified',
              Value: 'true',
            },
          ],
          UserPoolId: userPoolId,
          Username: userEmail,
        };

        console.log('adminUpdateUserParams', adminUpdateUserParams);
        await cognito.adminUpdateUserAttributes(adminUpdateUserParams);
      }

      //paginationToken = data.PaginationToken;

      // eslint-disable-next-line no-constant-condition
    } while (false);

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Error updating users:', error);
  }
}

async function main() {
  await cognitoLowerCaseMigration({
    userPoolId: applicationContext.environment.userPoolId,
  });
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
