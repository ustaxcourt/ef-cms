exports.getItemInteractor = async ({ applicationContext, key }) => {
  return await applicationContext.getPersistenceGateway().getItem({
    applicationContext,
    key,
  });
};
