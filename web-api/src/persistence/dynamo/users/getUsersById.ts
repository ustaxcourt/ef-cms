import { batchGet } from '../../dynamodbClientService';
import { uniq } from 'lodash';

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
    keys: uniq(userIds).map(userId => ({
      pk: `user|${userId}`,
      sk: `user|${userId}`,
    })),
  });
};
