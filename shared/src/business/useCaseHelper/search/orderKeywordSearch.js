/**
 * orderKeywordSearch
 *
 * @param {object} providers the providers object containing applicationContext, orderKeyword
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.orderEventCodes the given order event codes
 * @param {string} providers.orderKeyword the search term to look for in documents
 * @returns {object} the orders data
 */
exports.orderKeywordSearch = async ({
  applicationContext,
  caseTitleOrPetitioner,
  docketNumber,
  endDate,
  judge,
  orderEventCodes,
  orderKeyword,
  startDate,
}) => {
  const foundOrders = await applicationContext
    .getPersistenceGateway()
    .orderKeywordSearch({
      applicationContext,
      caseTitleOrPetitioner,
      docketNumber,
      endDate,
      judge,
      orderEventCodes,
      orderKeyword,
      startDate,
    });

  return foundOrders;
};
