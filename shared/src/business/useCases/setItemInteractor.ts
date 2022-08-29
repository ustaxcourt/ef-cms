exports.setItemInteractor = (applicationContext, { key, value }) =>
  applicationContext.getPersistenceGateway().setItem({
    applicationContext,
    key,
    value,
  });
