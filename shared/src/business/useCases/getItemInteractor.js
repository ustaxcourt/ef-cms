exports.getItemInteractor = async ({ applicationContext, key }) => {
  return applicationContext.getPersistenceGateway().getItem({
    applicationContext,
    key,
  });
};
