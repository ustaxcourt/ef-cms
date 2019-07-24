exports.setItemInteractor = async ({ applicationContext, key, value }) => {
  return applicationContext.getPersistenceGateway().setItem({
    applicationContext,
    key,
    value,
  });
};
