import * as client from '../../dynamodbClientService';

/**
 * getUserById
 *
 * @param {string} userId the id of the user
 * @returns {*} result returned from persistence
 */
export const getUserById = ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}) =>
  client.get({
    Key: {
      pk: `user|${userId}`,
      sk: `user|${userId}`,
    },
    applicationContext,
  });
