import { changePassword } from '@web-api/gateways/user/changePassword';
import { confirmSignUp } from '@web-api/gateways/user/confirmSignUp';
import { createUser } from '@web-api/gateways/user/createUser';
import { disableUser } from '@web-api/gateways/user/disableUser';
import { forgotPassword } from '@web-api/gateways/user/forgotPassword';
import { getUserByEmail } from '@web-api/gateways/user/getUserByEmail';
import { initiateAuth } from '@web-api/gateways/user/initiateAuth';
import { renewIdToken } from '@web-api/gateways/user/renewIdToken';
import { signUp } from '@web-api/gateways/user/signUp';
import { updateUser } from '@web-api/gateways/user/updateUser';

/*
####################### WARNING! ##########################
Every call into the userGateway (cognito) must lowercase the user's email address if it is an input to the function.
We need to lowercase the email address as we currently have a case SENSITIVE User pool in cognito and we store all email addresses in lowercase.
*/
export const getUserGateway = () => ({
  changePassword,
  confirmSignUp,
  createUser,
  disableUser,
  forgotPassword,
  getUserByEmail,
  initiateAuth,
  renewIdToken,
  signUp,
  updateUser,
});
