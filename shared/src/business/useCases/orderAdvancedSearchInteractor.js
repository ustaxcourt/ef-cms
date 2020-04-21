const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Document } = require('../../business/entities/Document');
const { map } = require('lodash');
const { OrderSearch } = require('../../business/entities/orders/OrderSearch');
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
  endDateDay,
  endDateMonth,
  endDateYear,
  judge,
  orderKeyword,
  startDateDay,
  startDateMonth,
  startDateYear,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADVANCED_SEARCH)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const orderEventCodes = map(Document.ORDER_DOCUMENT_TYPES, 'eventCode');

  const orderSearch = new OrderSearch({
    caseTitleOrPetitioner,
    docketNumber,
    endDateDay,
    endDateMonth,
    endDateYear,
    judge,
    orderKeyword,
    startDateDay,
    startDateMonth,
    startDateYear,
  });

  const rawSearch = orderSearch.validate().toRawObject();

  return await applicationContext.getPersistenceGateway().orderKeywordSearch({
    applicationContext,
    orderEventCodes,
    ...rawSearch,
  });
};
