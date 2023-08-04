import { batchDelete, get } from '../../dynamodbClientService';

/**
 * deleteUserConnection
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.connectionId the websocket connection id
 * @returns {Promise} the promise of the call to persistence
 */
export const deleteUserConnection = async ({
  applicationContext,
  connectionId,
}: {
  applicationContext: IApplicationContext;
  connectionId: string;
}) => {
  const connection = await get({
    Key: {
      pk: `connection|${connectionId}`,
      sk: `connection|${connectionId}`,
    },
    applicationContext,
  });

  if (!connection) {
    return;
  }

  const toDelete = [connection];

  const userConnection = await get({
    Key: {
      pk: `user|${connection.userId}`,
      sk: `connection|${connection.connectionId}`,
    },
    applicationContext,
  });

  if (userConnection) {
    toDelete.push(userConnection);
  }

  await batchDelete({
    applicationContext,
    items: toDelete,
  });
};
