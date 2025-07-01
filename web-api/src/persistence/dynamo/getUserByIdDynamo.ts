import { applicationContext } from '@web-api/applicationContext';
import { get } from '@web-api/persistence/dynamodbClientService';

// 10495: This function should be deleted once all users have been moved to postgres. It only exists for migrating data purposes.
export async function getUserByIdDynamo({ userId }: { userId: string }) {
  return await get({
    Key: {
      pk: `user|${userId}`,
      sk: `user|${userId}`,
    },
    applicationContext,
  });
}
