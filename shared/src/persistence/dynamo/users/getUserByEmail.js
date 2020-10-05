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

  const results = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `user-email|${formattedEmail}`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  if (results && results.length) {
    const { userId } = results[0];
    return await getUserById({ applicationContext, userId });
  }
};
