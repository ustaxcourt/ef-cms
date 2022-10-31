import { getUserById } from './getUserById';
import { query } from '../../dynamodbClientService';

/**
 * getUserByEmail
 *
 * @param {string} email the email of the user
 * @returns {*} result returned from persistence
 */
export const getUserByEmail = async ({
  applicationContext,
  email,
}: {
  applicationContext: IApplicationContext;
  email: string;
}) => {
  const formattedEmail = email.toLowerCase().trim();

  const results = await query({
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
