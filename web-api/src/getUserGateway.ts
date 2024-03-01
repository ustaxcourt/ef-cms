import { getUserByEmail } from '@web-api/gateways/user/getUserByEmail';
import { renewIdToken } from '@web-api/gateways/user/renewIdToken';

export const getUserGateway = () => ({
  getUserByEmail,
  renewIdToken,
});
