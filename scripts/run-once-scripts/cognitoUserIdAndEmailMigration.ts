import { ListUsersCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import {
  ServerApplicationContext,
  createApplicationContext,
} from '../../web-api/src/applicationContext';

const dryRun = false;

async function main() {
  const applicationContext = createApplicationContext({});
  const start = Date.now();

  try {
    let paginationToken;
    let completedUsers = 0;

    do {
      const data = await applicationContext.getCognito().listUsers({
        Limit: 10,
        PaginationToken: paginationToken,
        UserPoolId: applicationContext.environment.userPoolId,
      });

      await new Promise(resolve => setTimeout(resolve, 300));
      await assignCustomUserId(data, applicationContext);
      await new Promise(resolve => setTimeout(resolve, 300));
      await lowerCaseUserEmail(data, applicationContext);

      paginationToken = data.PaginationToken;
      completedUsers += 10;

      console.log(
        `********** COMPLETED BATCH, total users migrated ${completedUsers} **********`,
      );
    } while (paginationToken);
  } catch (error) {
    console.error('Error updating users:', error);
  }
  console.log('Time to run: ', (Date.now() - start) / 1000, 's');
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
          Username: userSub,
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
      const userSub = user.Attributes?.find(attr => {
        return attr.Name === 'sub';
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
          Username: userSub,
        });
      }
    }),
  );
}
