const {
  DocumentSearch,
} = require('../../business/entities/documents/DocumentSearch');
const {
  InternalDocumentSearchResult,
} = require('../entities/documents/InternalDocumentSearchResult');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const {
  MAX_SEARCH_RESULTS,
  ORDER_EVENT_CODES,
  ORDER_JUDGE_FIELD,
} = require('../../business/entities/EntityConstants');
const { caseSearchFilter } = require('../utilities/caseFilter');
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
  endDate,
  judge,
  keyword,
  startDate,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADVANCED_SEARCH)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let omitSealed = false;
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.VIEW_SEALED_CASE)) {
    omitSealed = true;
  }

  const orderSearch = new DocumentSearch({
    caseTitleOrPetitioner,
    docketNumber,
    endDate,
    judge,
    keyword,
    startDate,
  });

  const rawSearch = orderSearch.validate().toRawObject();

  const results = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: ORDER_EVENT_CODES,
      judgeType: ORDER_JUDGE_FIELD,
      omitSealed,
      ...rawSearch,
    });

  const filteredResults = caseSearchFilter(results, authorizedUser).slice(
    0,
    MAX_SEARCH_RESULTS,
  );

  return InternalDocumentSearchResult.validateRawCollection(filteredResults, {
    applicationContext,
  });
};
