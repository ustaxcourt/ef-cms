export const setItemInteractor = (
  applicationContext: any, // any until we refactor the client
  { key, value }: { key: string; value: string },
): Promise<void> =>
  applicationContext.getPersistenceGateway().setItem({
    applicationContext,
    key,
    value,
  });
