export const startPollingForResultsInteractor = async (
  applicationContext: IApplicationContext,
  { requestId }: { requestId: string },
): Promise<{ response: any } | undefined> => {
  const user = applicationContext.getCurrentUser();

  const record = await applicationContext
    .getPersistenceGateway()
    .getRequestResults({
      applicationContext,
      requestId,
      userId: user.userId,
    });

  return record ? { response: record.response } : undefined;
};
