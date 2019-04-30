exports.setItem = async ({ key, value, applicationContext }) => {
  return applicationContext.getPersistenceGateway().setItem({
    applicationContext,
    key,
    value,
  });
};
