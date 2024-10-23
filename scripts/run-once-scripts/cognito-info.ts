import { UserType } from '@aws-sdk/client-cognito-identity-provider';
import { createApplicationContext } from '../../web-api/src/applicationContext';
import { environment } from '../../web-api/src/environment';

async function main() {
  const applicationContext = createApplicationContext({});
  const cognito = applicationContext.getCognito();

  const expectedAttributes = ['custom:userId', 'name', 'email', 'custom:role'];
  const piiFields: (string | undefined)[] = [/*'name', 'email'*/];
  const usersMissingAttributes: UserType[] = [];
  const missingFieldSummary = {
    ['custom:userId']: 0,
    name: 0,
    email: 0,
    ['custom:role']: 0,
  };

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
        expectedAttribute => {
          const theField = user.Attributes?.find(
            cognitoAttribute => cognitoAttribute.Name === expectedAttribute,
          );

          if (!theField) {
            missingFieldSummary[expectedAttribute]++;
          }
          return !!theField;
        },
      );

      if (!userHasAllAttributes) {
        user.Attributes?.forEach(cogAttribute => {
          if (piiFields.includes(cogAttribute.Name) && cogAttribute.Value) {
            cogAttribute.Value = '*******';
          }
        });

        const userHasUserId = user.Attributes?.find(
          attribute => attribute.Name === 'custom:userId',
        );

        if (!userHasUserId) usersMissingAttributes.push(user);
      }
    });

    usersCompleted = usersCompleted + 60;
    console.log('Users Completed: ', usersCompleted);
  } while (PaginationToken);

  console.log(
    'Users missing attributes: ',
    JSON.stringify(usersMissingAttributes, null, 2),
  );
  console.log(
    'Users missing attributes (count): ',
    usersMissingAttributes.length,
  );
  console.log(missingFieldSummary);
}

void main();
