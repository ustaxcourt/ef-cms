const { map } = require('lodash');
const { Order } = require('../../entities/orders/Order');

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
  caseTitleOrPetitioner,
  docketNumber,
  endDate,
  judge,
  orderKeyword,
  startDate,
}) => {
  const orderEventCodes = map(Order.ORDER_TYPES, 'eventCode');
  return await applicationContext.getPersistenceGateway().orderKeywordSearch({
    applicationContext,
    caseTitleOrPetitioner,
    docketNumber,
    endDate,
    judge,
    orderEventCodes,
    orderKeyword,
    startDate,
  });
};
