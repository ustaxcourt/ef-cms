import { getUserByEmail } from '@web-api/gateways/user/getUserByEmail';

export const getUserGateway = () => ({
  getUserByEmail,
});
