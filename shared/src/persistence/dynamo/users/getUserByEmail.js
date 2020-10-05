const client = require('../../dynamodbClientService');
const { getUserById } = require('./getUserById');

/**
 * getUserByEmail
 *
 * @param {string} email the email of the user
 * @returns {*} result returned from persistence
 */
exports.getUserByEmail = async ({ applicationContext, email }) => {
  const formattedEmail = email.toLowerCase().trim();

  const user = await client.get({
    Key: {
      pk: `user-email|${formattedEmail}`,
    },
    applicationContext,
  });

  if (user) {
    const { userId } = user;
    return await getUserById({ applicationContext, userId });
  }
};
