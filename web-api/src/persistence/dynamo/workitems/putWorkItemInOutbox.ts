import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { createSectionOutboxRecords } from './createSectionOutboxRecords';
import { createUserOutboxRecord } from './createUserOutboxRecord';
import { get } from '../../dynamodbClientService';

export const putWorkItemInOutbox = async ({
  applicationContext,
  authorizedUser,
  workItem,
}: {
  applicationContext: ServerApplicationContext;
  authorizedUser: AuthUser;
  workItem: RawWorkItem;
}) => {
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
