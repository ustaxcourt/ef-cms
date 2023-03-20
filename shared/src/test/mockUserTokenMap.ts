const mockUsers = require('../../../web-api/storage/fixtures/seed/users.json');
const { pick } = require('lodash');

/**
 * Mock users for logging in locally
 */
const userMap = {};

mockUsers.forEach(userRecord => {
  if (!userRecord.userId) return;
  const newUser = pick(userRecord, ['email', 'name', 'userId']);
  newUser['custom:role'] = userRecord.role;
  userMap[newUser.email] = newUser;
});

exports.userMap = userMap;
