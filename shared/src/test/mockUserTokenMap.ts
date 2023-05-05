import { pick } from 'lodash';
import mockUsers from '../../../web-api/storage/fixtures/seed/users.json';

/**
 * Mock users for logging in locally
 */
const intermediary = {};

mockUsers.forEach(userRecord => {
  if (!userRecord.userId) return;
  const newUser = pick(userRecord, ['email', 'name', 'userId']);
  newUser['custom:role'] = userRecord.role;
  intermediary[newUser.email] = newUser;
});

export const userMap = intermediary;
