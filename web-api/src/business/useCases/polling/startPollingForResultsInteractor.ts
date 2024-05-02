export const startPollingForResultsInteractor = async (
  applicationContext: IApplicationContext,
  { requestId }: { requestId: string },
): Promise<{ response: any } | undefined> => {
  const user = applicationContext.getCurrentUser();

  const records = await applicationContext
    .getPersistenceGateway()
    .getRequestResults({
      applicationContext,
      requestId,
      userId: user.userId,
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
