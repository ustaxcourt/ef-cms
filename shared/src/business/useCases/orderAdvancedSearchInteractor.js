const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { map } = require('lodash');
const { Order } = require('../entities/orders/Order');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * orderAdvancedSearchInteractor
 *
 * @param {object} providers the providers object containing applicationContext, orderKeyword, caseTitleOrPetitioner, docketNumber, judge, startDate, endDate
 * @returns {object} the orders data
 */
exports.orderAdvancedSearchInteractor = async ({
  applicationContext,
  caseTitleOrPetitioner,
  docketNumber,
  endDate,
  judge,
  orderKeyword,
  startDate,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADVANCED_SEARCH)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const orderEventCodes = map(Order.ORDER_TYPES, 'eventCode');

  return await applicationContext.getUseCaseHelpers().orderKeywordSearch({
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
