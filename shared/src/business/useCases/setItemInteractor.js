exports.setItemInteractor = async (applicationContext, { key, value }) => {
  return await applicationContext.getPersistenceGateway().setItem({
    applicationContext,
    key,
    value,
  });
};
