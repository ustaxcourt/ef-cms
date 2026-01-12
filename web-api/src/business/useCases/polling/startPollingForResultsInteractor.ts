import { UnauthorizedError } from '@web-api/errors/errors';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';

import { getRequestResults } from '@web-api/persistence/postgres/polling/getRequestResults';

export const startPollingForResultsInteractor = async (
  { requestId }: { requestId: string },
  authorizedUser: UnknownAuthUser,
): Promise<{ response: string } | undefined> => {
  if (!isAuthUser(authorizedUser)) {
    throw new UnauthorizedError(
      'User attempting to poll for results is not an auth user',
    );
  }

  const record = await getRequestResults({
    requestId,
    userId: authorizedUser.userId,
  });

  
  if (!record) return undefined;
  const { responseString } = record;

  return {
    response: responseString,
  };
};
