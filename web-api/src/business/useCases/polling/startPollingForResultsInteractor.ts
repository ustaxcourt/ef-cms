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
  if (!isAuthUser(authorizedUser)) {
    throw new UnauthorizedError(
      'User attempting to poll for results is not an auth user',
    );
  }

  const responseString = await getRequestResults({
    requestId,
    userId: authorizedUser.userId,
  });

  if (!responseString) return undefined;

  return {
    response: responseString,
  };
};
