export const setItemInteractor = (
  applicationContext: IApplicationContext,
  { key, value }: { key: string; value: string },
): Promise<void> =>
  applicationContext.getPersistenceGateway().setItem({
    applicationContext,
    key,
    value,
  });
