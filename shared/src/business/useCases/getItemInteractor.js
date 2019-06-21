exports.getItem = async ({ applicationContext, key }) => {
  return applicationContext.getPersistenceGateway().getItem({
    applicationContext,
    key,
  });
};
