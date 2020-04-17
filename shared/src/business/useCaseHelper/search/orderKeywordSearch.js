/**
 * orderKeywordSearch
 *
 * @param {object} providers the providers object containing applicationContext, orderKeyword
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.orderKeyword the search term to look for in documents
 * @returns {object} the orders data
 */
exports.orderKeywordSearch = async ({
  applicationContext,
  orderEventCodes,
  orderKeyword,
}) => {
  const foundOrders = await applicationContext
    .getPersistenceGateway()
    .orderKeywordSearch({
      applicationContext,
      orderEventCodes,
      orderKeyword,
    });

  for (const order of foundOrders) {
    const { caseId } = order;

    const matchingCase = await applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId({
        applicationContext,
        caseId,
      });
    order.docketNumberSuffix = matchingCase.docketNumberSuffix;
    order.caseCaption = matchingCase.caseCaption;
  }

  return foundOrders;
};
