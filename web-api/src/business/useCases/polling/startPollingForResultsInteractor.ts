import { UnauthorizedError } from '@web-api/errors/errors';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';

import { getRequestResults } from '@web-api/persistence/postgres/polling/getRequestResults';

export const startPollingForResultsInteractor = async (
  { requestId }: { requestId: string },
  authorizedUser: UnknownAuthUser,
): Promise<{ response: any } | undefined> => {
  console.log(`Important!!! We are hitting a new implementation!`);
  if (!isAuthUser(authorizedUser)) {
    throw new UnauthorizedError(
      'User attempting to poll for results is not an auth user',
    );
  }

  const records = await getRequestResults({
    requestId,
    userId: authorizedUser.userId,
  });

  console.log(`!!!!!!!!!!!!!!!!!!!!!!!!`);
  console.log('Received records from getRequestResults:', records);
  console.log(`!!!!!!!!!!!!!!!!!!!!!!!!`);
  if (records.length === 0) return undefined;
  console.log(`After undefined check, records.length=${records.length}`);
  console.log(`records[0]:`, records[0]);
  console.log(`records: ${JSON.stringify(records)}`);
  const { responseString } = records[0];

  return {
    response: responseString,
  };
};
