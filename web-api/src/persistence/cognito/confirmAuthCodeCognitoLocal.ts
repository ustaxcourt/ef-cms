import { sign } from 'jsonwebtoken';
import { userMap } from '../../../../shared/src/test/mockUserTokenMap';

export const confirmAuthCodeCognitoLocal = async ({
  applicationContext,
  code,
  password,
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
    console.log('error!!!!!?', e.message);
    return {
      alertError: { message: e.message, title: e.message },
    };
  }

  if (result.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
    return {
      alertError: {
        message: 'NEW_PASSWORD_REQUIRED',
        sessionId: result.Session,
        title: 'NEW_PASSWORD_REQUIRED',
      },
    };
  }

  if (result.AuthenticationResult.IdToken) {
    return {
      refreshToken: result.AuthenticationResult.IdToken,
      token: result.AuthenticationResult.IdToken,
    };
  } else {
    return {
      alertError: {
        message: 'Login credentials not found.',
        title: 'Login error!',
      },
    };
  }
};
