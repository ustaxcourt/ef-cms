export const setItemInteractor = (
  applicationContext: IApplicationContext,
  { key, value }: { key: string; value: string },
) =>
  applicationContext.getPersistenceGateway().setItem({
    applicationContext,
    key,
    value,
  });
