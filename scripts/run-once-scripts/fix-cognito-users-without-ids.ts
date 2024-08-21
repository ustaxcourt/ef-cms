import { RawUser } from '../../shared/src/business/entities/User';
import {
  type ServerApplicationContext,
  createApplicationContext,
} from '../../web-api/src/applicationContext';
import { createPetitionerUserRecords } from '../../web-api/src/persistence/dynamo/users/createPetitionerUserRecords';
import { createUserConfirmation } from '../../web-api/src/business/useCaseHelper/auth/createUserConfirmation';
import { omit } from 'lodash';
import { usersWithoutUserIds } from './fix-cognito-users-without-ids-constants';
import type { UserType } from '@aws-sdk/client-cognito-identity-provider';

const getAttributeValue = (
  cognitoUser: UserType,
  attributeName: string,
): string | undefined => {
  return cognitoUser.Attributes?.find(attrib => attrib.Name === attributeName)
    ?.Value;
};

const buildRawUser = (cognitoUser: UserType): RawUser | undefined => {
  const userId = cognitoUser.Username;
  const email = getAttributeValue(cognitoUser, 'email');
  const name = getAttributeValue(cognitoUser, 'name');
  if (!!userId && !!email && !!name) {
    return {
      email,
      entityName: 'User',
      name,
      role: 'petitioner',
      userId,
    } as RawUser;
  }
};

const setUserAttributes = async ({
  applicationContext,
  cognitoUser,
}: {
  applicationContext: ServerApplicationContext;
  cognitoUser: UserType;
}): Promise<void> => {
  if (cognitoUser && cognitoUser.Username) {
    const cognito = applicationContext.getCognito();
    await cognito.adminUpdateUserAttributes({
      UserAttributes: [
        {
          Name: 'custom:userId',
          Value: cognitoUser.Username,
        },
        {
          Name: 'custom:role',
          Value: 'petitioner',
        },
      ],
      UserPoolId: applicationContext.environment.userPoolId,
      Username: cognitoUser.Username,
    });
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});

  const totals: {
    emailConfirmationsSent: number;
    userEntitiesCreatedInDynamo: number;
    usersUpdatedInCognito: number;
  } = {
    emailConfirmationsSent: 0,
    userEntitiesCreatedInDynamo: 0,
    usersUpdatedInCognito: 0,
  };
  for (const cognitoUser of usersWithoutUserIds) {
    const user = buildRawUser(cognitoUser);
    if (user) {
      await setUserAttributes({ applicationContext, cognitoUser });
      console.log(`Updated cognito user attributes for ${user.email}.`);
      totals.usersUpdatedInCognito++;

      if (!cognitoUser.Enabled) {
        continue;
      }

      await createPetitionerUserRecords({
        applicationContext,
        user: omit(user, 'userId'),
        userId: user.userId,
      });
      console.log(`Created petitioner entity in Dynamo for ${user.email}.`);
      totals.usersUpdatedInCognito++;

      if (cognitoUser.UserStatus === 'UNCONFIRMED') {
        await createUserConfirmation(applicationContext, {
          email: user.email!,
          userId: user.userId,
        });
        console.log(`Sent new email confirmation link to ${user.email}.`);
        totals.emailConfirmationsSent++;
      }
    }
  }
  console.log('Totals', totals);
})();
