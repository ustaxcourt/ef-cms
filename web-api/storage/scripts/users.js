const createApplicationContext = require('../../src/applicationContext');
const users = require('../fixtures/seed/users.json');
const uuidv4 = require('uuid/v4');
const {
  createUserRecords,
} = require('../../../shared/src/persistence/dynamo/users/createUser.js');
const { omit } = require('lodash');

let usersById = {};
let usersByEmail = {};

const EXCLUDE_PROPS = ['pk', 'sk', 'userId'];

module.exports.createUsers = async () => {
  const user = {
    role: 'admin',
  };

  const applicationContext = createApplicationContext(user);

  await Promise.all(
    users.map(userRecord => {
      if (!userRecord.userId) {
        return;
      }

      const { userId } = userRecord;

      return createUserRecords({
        applicationContext,
        user: omit(userRecord, EXCLUDE_PROPS),
        userId,
      }).then(userCreated => {
        usersById[userId] = userCreated;
        usersByEmail[userCreated.email] = userCreated;
      });
    }),
  );

  console.log(Object.keys(usersByEmail));
  console.log(Object.keys(usersById));
};

exports.asUserFromEmail = async (email, callback) => {
  const asUser = usersByEmail[email];
  if (!asUser) throw new Error('User not found');
  const applicationContext = createApplicationContext(asUser);
  return await callback(applicationContext);
};
