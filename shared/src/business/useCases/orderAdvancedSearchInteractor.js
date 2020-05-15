const {
  DocumentSearch,
} = require('../../business/entities/documents/DocumentSearch');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { caseSearchFilter } = require('../utilities/caseFilter');
const { Document } = require('../../business/entities/Document');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * orderAdvancedSearchInteractor
 *
 * @param {object} providers the providers object containing applicationContext, keyword, caseTitleOrPetitioner, docketNumber, judge, startDate, endDate
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
  keyword,
  startDateDay,
  startDateMonth,
  startDateYear,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADVANCED_SEARCH)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const orderSearch = new DocumentSearch({
    caseTitleOrPetitioner,
    docketNumber,
    endDateDay,
    endDateMonth,
    endDateYear,
    judge,
    keyword,
    startDateDay,
    startDateMonth,
    startDateYear,
  });

  const rawSearch = orderSearch.validate().toRawObject();

  const results = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: Document.ORDER_DOCUMENT_TYPES,
      judgeType: 'signedJudgeName',
      ...rawSearch,
    });

  const filteredResults = caseSearchFilter(results, authorizedUser);

  return filteredResults;
};
