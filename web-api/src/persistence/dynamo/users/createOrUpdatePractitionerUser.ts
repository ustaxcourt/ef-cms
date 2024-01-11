import * as client from '../../dynamodbClientService';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { RawUser } from '@shared/business/entities/User';
import { isUserAlreadyCreated } from './createOrUpdateUser';

export const createUserRecords = async ({
  applicationContext,
  user,
  userId,
}: {
  applicationContext: IApplicationContext;
  user: any;
  userId: string;
}) => {
  delete user.password;

  if (user.barNumber === '') {
    delete user.barNumber;
  }

  await client.put({
    Item: {
      ...user,
      pk: `user|${userId}`,
      sk: `user|${userId}`,
      userId,
    },
    applicationContext,
  });

  if (user.name && user.barNumber) {
    const upperCaseName = user.name.toUpperCase();
    await client.put({
      Item: {
        pk: `${user.role}|${upperCaseName}`,
        sk: `user|${userId}`,
      },
      applicationContext,
    });
    const upperCaseBarNumber = user.barNumber.toUpperCase();
    await client.put({
      Item: {
        pk: `${user.role}|${upperCaseBarNumber}`,
        sk: `user|${userId}`,
      },
      applicationContext,
    });
  }

  return {
    ...user,
    userId,
  };
};

export const createOrUpdatePractitionerUser = async ({
  applicationContext,
  user,
}: {
  applicationContext: IApplicationContext;
  user: RawUser;
}) => {
  let userId = applicationContext.getUniqueId();
  const practitionerRoleTypes = [
    ROLES.privatePractitioner,
    ROLES.irsPractitioner,
    ROLES.inactivePractitioner,
  ];

  if (!practitionerRoleTypes.includes(user.role)) {
    throw new Error(
      `Role must be ${ROLES.privatePractitioner}, ${ROLES.irsPractitioner}, or ${ROLES.inactivePractitioner}`,
    );
  }

  const userEmail = user.email || user.pendingEmail;

  if (!userEmail) {
    return await createUserRecords({
      applicationContext,
      user,
      userId,
    });
  }

  const userExists = await isUserAlreadyCreated({
    applicationContext,
    email: userEmail,
    userPoolId: process.env.USER_POOL_ID as string,
  });

  const cognito: CognitoIdentityProvider = applicationContext.getCognito();

  if (!userExists) {
    let params = {
      //TODO: make 1000000% sure this works fine on deployed env
      DesiredDeliveryMediums: ['EMAIL'],
      UserAttributes: [
        {
          Name: 'email_verified',
          Value: 'True',
        },
        {
          Name: 'email',
          Value: userEmail,
        },
        {
          Name: 'custom:role',
          Value: user.role,
        },
        {
          Name: 'name',
          Value: user.name,
        },
      ],
      UserPoolId: process.env.USER_POOL_ID,
      Username: userEmail,
    };
    //TODO: deal with type error on params
    const response = await cognito.adminCreateUser(params);
    console.log('*** response', response.User.Attributes);
    //replace sub here
    if (response && response.User && response.User.Username) {
      console.log('*** userId1', userId);
      const userIdAttribute = // (response.User.Attributes?.find(element => {
        //   if (element.Name === 'custom:userId') {
        //     return element.Value;
        //   }
        // }) as unknown as string) ||
        response.User.Attributes?.find(element => {
          if (element.Name === 'sub') {
            return element;
          }
        });
      userId = userIdAttribute?.Value!;
    }
  } else {
    console.log('*** wrong if statement', userId);
    const response = await cognito.adminGetUser({
      UserPoolId: process.env.USER_POOL_ID,
      Username: userEmail,
    });

    await cognito.adminUpdateUserAttributes({
      UserAttributes: [
        {
          Name: 'custom:role',
          Value: user.role,
        },
      ],
      UserPoolId: process.env.USER_POOL_ID,
      // and here
      Username: response.Username,
    });
    // and here
    userId =
      (response.UserAttributes?.find(element => {
        if (element.Name === 'custom:userId') {
          return element.Value;
        }
      }) as unknown as string) ||
      (response.UserAttributes?.find(element => {
        if (element.Name === 'sub') {
          return element.Value;
        }
      })! as unknown as string);
    console.log('*** wrong if statement2', userId);
  }
  console.log('*** userId3', userId);
  return await createUserRecords({
    applicationContext,
    user,
    userId,
  });
};
