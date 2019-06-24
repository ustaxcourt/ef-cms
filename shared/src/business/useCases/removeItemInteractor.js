exports.removeItem = async ({ applicationContext, key }) => {
  return applicationContext.getPersistenceGateway().removeItem({
    applicationContext,
    key,
  });
};
