exports.removeItem = async ({ key, applicationContext }) => {
  return applicationContext.getPersistenceGateway().removeItem({
    applicationContext,
    key,
  });
};
