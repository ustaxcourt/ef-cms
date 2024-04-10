import { ListUsersCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import {
  ServerApplicationContext,
  createApplicationContext,
} from '../../web-api/src/applicationContext';

const dryRun = true;

async function main() {
  const applicationContext = createApplicationContext({});

  try {
    let paginationToken;

    do {
      const data = await applicationContext.getCognito().listUsers({
        Limit: 25,
        PaginationToken: paginationToken,
        UserPoolId: applicationContext.environment.userPoolId,
      });

      await assignCustomUserId(data, applicationContext);
      await lowerCaseUserEmail(data, applicationContext);

      console.log('********** COMPLETED BATCH **********');

      paginationToken = data.PaginationToken;
    } while (paginationToken);
  } catch (error) {
    console.error('Error updating users:', error);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();

async function assignCustomUserId(
  data: ListUsersCommandOutput,
  applicationContext: ServerApplicationContext,
) {
  const usersToUpdate =
    data.Users?.filter(
      user => !user.Attributes?.find(attr => attr.Name === 'custom:userId'),
    ) || [];

  await Promise.all(
    usersToUpdate.map(user => {
      const userEmail = user.Attributes?.find(attr => {
        return attr.Name === 'email';
      })?.Value;
      const userSub = user.Attributes?.find(attr => {
        return attr.Name === 'sub';
      })?.Value;

      console.log('Custom userId to update: ', userEmail, userSub);

      if (!dryRun) {
        return applicationContext.getCognito().adminUpdateUserAttributes({
          UserAttributes: [
            {
              Name: 'custom:userId',
              Value: userSub,
            },
          ],
          UserPoolId: applicationContext.environment.userPoolId,
          Username: userEmail,
        });
      }
    }),
  );
}

async function lowerCaseUserEmail(
  data: ListUsersCommandOutput,
  applicationContext: ServerApplicationContext,
): Promise<void> {
  const usersWithMixedCaseEmails =
    data.Users?.filter(user => {
      const emailAddress = user.Attributes?.find(
        attr => attr.Name === 'email',
      )?.Value;
      return emailAddress?.toLowerCase() !== emailAddress;
    }) || [];

  await Promise.all(
    usersWithMixedCaseEmails.map(user => {
      const userEmail = user.Attributes?.find(attr => {
        return attr.Name === 'email';
      })?.Value;

      console.log('Email to update: ', userEmail, userEmail?.toLowerCase());

      if (!dryRun) {
        return applicationContext.getCognito().adminUpdateUserAttributes({
          UserAttributes: [
            {
              Name: 'email',
              Value: userEmail?.toLowerCase(),
            },
          ],
          UserPoolId: applicationContext.environment.userPoolId,
          Username: userEmail,
        });
      }
    }),
  );
}
