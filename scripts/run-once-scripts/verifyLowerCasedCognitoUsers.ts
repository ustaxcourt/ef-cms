import {
  ListUsersCommandOutput,
  UserStatusType,
} from '@aws-sdk/client-cognito-identity-provider';
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
      const usersPerBatch = 10;

      const data = await applicationContext.getCognito().listUsers({
        Limit: usersPerBatch,
        PaginationToken: paginationToken,
        UserPoolId: applicationContext.environment.userPoolId,
      });

      await new Promise(resolve => setTimeout(resolve, 300));
      await verifyLowerCasedEmails(data, applicationContext);

      paginationToken = data.PaginationToken;
      completedUsers += usersPerBatch;

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

async function verifyLowerCasedEmails(
  data: ListUsersCommandOutput,
  applicationContext: ServerApplicationContext,
): Promise<void> {
  const usersWhoHaveUnverifiedEmailsButShouldNot =
    data.Users?.filter(user => {
      const emailIsUnverified =
        user.Attributes?.find(attr => attr.Name === 'email_verified')?.Value ===
        'false';
      const userIsConfirmedOrForceChange = [
        UserStatusType.CONFIRMED,
        UserStatusType.FORCE_CHANGE_PASSWORD,
      ].includes(user.UserStatus);

      return emailIsUnverified && userIsConfirmedOrForceChange;
    }) || [];

  await Promise.all(
    usersWhoHaveUnverifiedEmailsButShouldNot.map(user => {
      const userEmail = user.Attributes?.find(attr => {
        return attr.Name === 'email';
      })?.Value;
      const userSub = user.Attributes?.find(attr => {
        return attr.Name === 'sub';
      })?.Value;

      console.log('Email to update: ', userEmail);

      if (!dryRun) {
        return applicationContext.getCognito().adminUpdateUserAttributes({
          UserAttributes: [
            {
              Name: 'email_verified',
              Value: 'true',
            },
          ],
          UserPoolId: applicationContext.environment.userPoolId,
          Username: userSub,
        });
      }
    }),
  );
}
