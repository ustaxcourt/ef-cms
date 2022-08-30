export const removeItemInteractor = (applicationContext, { key }) => {
  return applicationContext.getPersistenceGateway().removeItem({
    applicationContext,
    key,
  });
};
