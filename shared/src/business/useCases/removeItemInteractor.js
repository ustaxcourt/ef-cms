exports.removeItemInteractor = async (applicationContext, { key }) => {
  return await applicationContext.getPersistenceGateway().removeItem({
    applicationContext,
    key,
  });
};
