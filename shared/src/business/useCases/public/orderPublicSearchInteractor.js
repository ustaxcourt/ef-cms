/**
 * orderPublicSearchInteractor
 *
 * @param {object} providers object containing applicationContext and other necessary parameters needed for the interactor
 * @param {object} providers.applicationContext application context object
 * @param {object} providers.orderKeyword the keyword to be used in the order search
 * @returns {object} the case data
 */
exports.orderPublicSearchInteractor = async ({
  applicationContext,
  orderKeyword,
}) =>
  await applicationContext
    .getUseCaseHelpers()
    .orderKeywordSearch({ applicationContext, orderKeyword });
