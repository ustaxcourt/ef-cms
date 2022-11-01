import { createSectionOutboxRecords } from './createSectionOutboxRecords';
import { createUserOutboxRecord } from './createUserOutboxRecord';

export const putWorkItemInUsersOutbox = async ({
  applicationContext,
  section,
  userId,
  workItem,
}) => {
  await Promise.all([
    createUserOutboxRecord({
      applicationContext,
      userId,
      workItem,
    }),
    createSectionOutboxRecords({
      applicationContext,
      section,
      workItem,
    }),
  ]);
};
