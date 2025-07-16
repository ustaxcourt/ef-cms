import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';

export const startPollingForResultsInteractor = async (
  applicationContext: ServerApplicationContext,
  { requestId }: { requestId: string },
  authorizedUser: UnknownAuthUser,
): Promise<{ response: any } | undefined> => {
  if (!isAuthUser(authorizedUser)) {
    throw new UnauthorizedError(
      'User attempting to poll for results is not an auth user',
    );
  }

  const records = await applicationContext
    .getPersistenceGateway()
    .getRequestResults({
      applicationContext,
      requestId,
      userId: authorizedUser.userId,
    });

  if (records.length === 0) return undefined;

  const { totalNumberOfChunks } = records[0];

  if (records.length !== totalNumberOfChunks) return undefined;

  let response = '';
  records
    .sort((a, b) => a.index - b.index)
    .forEach(record => {
      response += record.chunk;
    });

  return {
    response,
  };
};
