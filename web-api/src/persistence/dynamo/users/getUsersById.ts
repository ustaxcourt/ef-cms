import { batchGet } from '../../dynamodbClientService';

/**
 * getUsersById
 *
 * @param {array} userIds an array of userIds (string) for a user
 * @returns {*} result returned from persistence
 */
export const getUsersById = async ({
  applicationContext,
  userIds,
}: {
  applicationContext: IApplicationContext;
  userIds: string[];
}) => {
  return await batchGet({
    applicationContext,
    keys: userIds.map(userId => ({
      pk: `user|${userId}`,
      sk: `user|${userId}`,
    })),
  });
};
