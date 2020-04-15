exports.orderPublicSearchInteractor = async ({
  applicationContext,
  orderKeyword,
}) =>
  await applicationContext
    .getUseCaseHelpers()
    .orderKeywordSearch({ applicationContext, orderKeyword });
