import { sign } from 'jsonwebtoken';
import { userMap } from '../../../../shared/src/test/mockUserTokenMap';

export const confirmAuthCodeLocal = ({ code }) => {
  const email = code.toLowerCase();
  if (userMap[email]) {
    const user = {
      ...userMap[email],
      sub: userMap[email].userId,
    };
    const token = sign(user, 'secret');
    return {
      refreshToken: token,
      token,
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
