import { changePassword } from '@web-api/gateways/user/changePassword';
import { disableUser } from '@web-api/gateways/user/disableUser';
import { forgotPassword } from '@web-api/gateways/user/forgotPassword';
import { getUserByEmail } from '@web-api/gateways/user/getUserByEmail';
import { initiateAuth } from '@web-api/gateways/user/initiateAuth';
import { renewIdToken } from '@web-api/gateways/user/renewIdToken';
import { updateUser } from '@web-api/gateways/user/updateUser';

export const getUserGateway = () => ({
  changePassword,
  disableUser,
  forgotPassword,
  getUserByEmail,
  initiateAuth,
  renewIdToken,
  updateUser,
});
