import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const startPollingForResultsInteractor = async (
  applicationContext: ServerApplicationContext,
  { requestId }: { requestId: string },
  authorizedUser: UnknownAuthUser,
): Promise<{ response: any } | undefined> => {
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
