import { createApplicationContext } from '../../web-api/src/applicationContext';
import { environment } from '../../web-api/src/environment';
import { ROLES } from '../../shared/src/business/entities/EntityConstants';

async function main() {
  const applicationContext = createApplicationContext({});
  const cognito = applicationContext.getCognito();
  const PAGE_SIZE = 10;

  let PaginationToken: string | undefined;
  let usersCompleted = 0;
  do {
    await new Promise(resolve => setTimeout(resolve, 300));
    const response = await cognito.listUsers({
      Limit: PAGE_SIZE,
      PaginationToken,
      UserPoolId: environment.userPoolId,
    });

    PaginationToken = response.PaginationToken;
    response.Users?.forEach(async user => {
      const userHasRole = user.Attributes?.find(
        cognitoAttribute => cognitoAttribute.Name === 'custom:role',
      );

      if (!userHasRole) {
        await cognito.adminUpdateUserAttributes({
          UserAttributes: [
            {
              Name: 'custom:role',
              Value: ROLES.petitioner,
            },
          ],
          UserPoolId: environment.userPoolId,
          Username: user.Username,
        });
        console.log('Updated: ', user.Username);
      }
    });

    usersCompleted = usersCompleted + PAGE_SIZE;
    console.log('Users Completed: ', usersCompleted);
  } while (PaginationToken);
}

void main();
