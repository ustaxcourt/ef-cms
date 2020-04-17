const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Document } = require('../../business/entities/Document');
const { map } = require('lodash');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * orderAdvancedSearchInteractor
 *
 * @param {object} providers the providers object containing applicationContext, orderKeyword
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.orderKeyword the search term to look for in documents
 * @returns {object} the orders data
 */
exports.orderAdvancedSearchInteractor = async ({
  applicationContext,
  orderKeyword,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADVANCED_SEARCH)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const orderEventCodes = map(Document.ORDER_DOCUMENT_TYPES, 'eventCode');

  return await applicationContext.getUseCaseHelpers().orderKeywordSearch({
    applicationContext,
    orderEventCodes,
    orderKeyword,
  });
};
