exports.getItem = async ({ key, applicationContext }) => {
  return applicationContext.getPersistenceGateway().getItem({
    applicationContext,
    key,
  });
};
