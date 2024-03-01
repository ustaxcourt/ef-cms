import { getUserByEmail } from '@web-api/gateways/user/getUserByEmail';
import { initiateAuth } from '@web-api/gateways/user/initiateAuth';
import { renewIdToken } from '@web-api/gateways/user/renewIdToken';

export const getUserGateway = () => ({
  getUserByEmail,
  initiateAuth,
  renewIdToken,
});
