const createApplicationContext = require('../../src/applicationContext');
const users = require('../fixtures/seed/users.json');
const {
  createUserRecords,
} = require('../../../shared/src/persistence/dynamo/users/createUser.js');
const { omit } = require('lodash');

let usersByEmail = {};

const EXCLUDE_PROPS = ['pk', 'sk', 'userId'];

module.exports.createUsers = async () => {
  usersByEmail = {};

  const user = {
    role: 'admin',
  };

  const applicationContext = createApplicationContext(user);

  await Promise.all(
    users.map(userRecord => {
      if (!userRecord.userId) {
        throw new Error('User has no uuid');
      }

      const { userId } = userRecord;

      return createUserRecords({
        applicationContext,
        user: omit(userRecord, EXCLUDE_PROPS),
        userId,
      }).then(userCreated => {
        if (usersByEmail[userCreated.email]) {
          throw new Error('User already exists');
        }
        usersByEmail[userCreated.email] = userCreated;
      });
    }),
  );
};

module.exports.asUserFromEmail = async (email, callback) => {
  const asUser = usersByEmail[email];
  if (!asUser) {
    throw new Error('User not found');
  }
  const applicationContext = createApplicationContext(asUser);
  return await callback(applicationContext);
};
