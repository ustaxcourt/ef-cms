const createApplicationContext = require('../../src/applicationContext');
const users = require('../fixtures/seed/users.json');
const {
  createUserRecords,
} = require('../../../shared/src/persistence/dynamo/users/createUser.js');
const {
  createUserRecords: createPractitionerUserRecords,
} = require('../../../shared/src/persistence/dynamo/users/createPractitionerUser.js');
const {
  ROLES,
} = require('../../../shared/src/business/entities/EntityConstants');
const { omit } = require('lodash');

let usersByEmail = {};

const EXCLUDE_PROPS = ['pk', 'sk', 'userId'];

module.exports.createUsers = async () => {
  usersByEmail = {};

  const user = {
    role: ROLES.admin,
  };

  const applicationContext = createApplicationContext(user);

  await Promise.all(
    users.map(userRecord => {
      if (!userRecord.userId) {
        throw new Error('User has no uuid');
      }

      const { userId } = userRecord;

      if (
        [
          ROLES.irsPractitioner,
          ROLES.privatePractitioner,
          ROLES.inactivePractitioner,
        ].includes(userRecord.role)
      ) {
        return createPractitionerUserRecords({
          applicationContext,
          user: omit(userRecord, EXCLUDE_PROPS),
          userId,
        }).then(userCreated => {
          if (usersByEmail[userCreated.email]) {
            throw new Error('User already exists');
          }
          usersByEmail[userCreated.email] = userCreated;
        });
      }
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
