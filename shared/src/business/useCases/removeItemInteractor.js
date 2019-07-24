exports.removeItemInteractor = async ({ applicationContext, key }) => {
  return applicationContext.getPersistenceGateway().removeItem({
    applicationContext,
    key,
  });
};
