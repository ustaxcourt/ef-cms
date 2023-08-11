import { createSectionOutboxRecords } from './createSectionOutboxRecords';
import { createUserOutboxRecord } from './createUserOutboxRecord';
import { get } from '../../dynamodbClientService';

export const putWorkItemInOutbox = async ({ applicationContext, workItem }) => {
  const authorizedUser = applicationContext.getCurrentUser();

  const user = await get({
    Key: {
      pk: `user|${authorizedUser.userId}`,
      sk: `user|${authorizedUser.userId}`,
    },
    applicationContext,
  });

  await Promise.all([
    createUserOutboxRecord({
      applicationContext,
      userId: user.userId,
      workItem,
    }),
    createSectionOutboxRecords({
      applicationContext,
      section: user.section,
      workItem,
    }),
  ]);
};
