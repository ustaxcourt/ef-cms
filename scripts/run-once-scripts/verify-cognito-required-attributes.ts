import { createApplicationContext } from '../../web-api/src/applicationContext';
import { environment } from '../../web-api/src/environment';

async function main() {
  const applicationContext = createApplicationContext({});
  const cognito = applicationContext.getCognito();

  const expectedAttributes = ['custom:userId', 'name', 'email', 'custom:role'];

  let PaginationToken: string | undefined;
  let usersCompleted = 0;
  do {
    const response = await cognito.listUsers({
      Limit: 60,
      PaginationToken,
      UserPoolId: environment.userPoolId,
    });

    // eslint-disable-next-line prefer-destructuring
    PaginationToken = response.PaginationToken;
    response.Users?.forEach(user => {
      const userHasAllAttributes = expectedAttributes.every(
        expctedAttribute =>
          !!user.Attributes?.find(
            cognitoAttribute => cognitoAttribute.Name === expctedAttribute,
          ),
      );

      if (!userHasAllAttributes) {
        console.log('User does not have required attributes', user);
      }
    });
    usersCompleted = usersCompleted + 60;
    console.log('Users Completed: ', usersCompleted);
  } while (PaginationToken);
}

void main();
