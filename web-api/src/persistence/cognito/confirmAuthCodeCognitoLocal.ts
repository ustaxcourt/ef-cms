import { sign } from 'jsonwebtoken';
import { userMap } from '../../../../shared/src/test/mockUserTokenMap';

export const confirmAuthCodeCognitoLocal = async ({
  applicationContext,
  code,
  password,
}: {
  applicationContext: IApplicationContext;
  code: string;
  password?: string;
}) => {
  // fallback to allow current local user to be assumed
  if (userMap[code.toLowerCase()]) {
    const user = {
      ...userMap[code.toLowerCase()],
      sub: userMap[code.toLowerCase()].userId,
    };
    const token = sign(user, 'secret');
    return {
      refreshToken: token,
      token,
    };
  }

  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    AuthParameters: {
      PASSWORD: password,
      USERNAME: code,
    },
    ClientId: process.env.COGNITO_CLIENT_ID,
  };

  let result;

  try {
    result = await applicationContext
      .getCognito()
      .initiateAuth(params)
      .promise();
  } catch (e) {
    return {
      alertError: {
        message: (e as Error).message,
        title: (e as Error).message,
      },
    };
  }

  if (
    result.ChallengeName &&
    result.ChallengeName === 'NEW_PASSWORD_REQUIRED'
  ) {
    return {
      alertError: {
        message: 'NEW_PASSWORD_REQUIRED',
        sessionId: result.Session,
        title: 'NEW_PASSWORD_REQUIRED',
      },
    };
  }

  return {
    refreshToken: result.AuthenticationResult.IdToken,
    token: result.AuthenticationResult.IdToken,
  };
};
