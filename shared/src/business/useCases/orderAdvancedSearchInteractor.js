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
const { formatNow } = require('../../business/utilities/DateHandler');
const { omit } = require('lodash');
const { UnauthorizedError } = require('../../errors/errors');
/**
 * orderAdvancedSearchInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.caseTitleOrPetitioner case title or petitioner to search for
 * @param {string} providers.docketNumber docket number
 * @param {string} providers.endDate ending date for date range
 * @param {string} providers.judge judge name to filter by
 * @param {string} providers.keyword keyword to search for
 * @param {string} providers.startDate start date for date range
 * @returns {object} the orders data
 */
exports.orderAdvancedSearchInteractor = async (
  applicationContext,
  {
    caseTitleOrPetitioner,
    docketNumber,
    endDate,
    from,
    judge,
    keyword,
    startDate,
  },
) => {
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
    from,
    judge,
    keyword,
    startDate,
    userRole: authorizedUser.role,
  });

  const rawSearch = orderSearch.validate().toRawObject();

  const { results } = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: ORDER_EVENT_CODES,
      judgeType: ORDER_JUDGE_FIELD,
      omitSealed,
      ...rawSearch,
    });

  const timestamp = formatNow('YYYY/MM/DD HH:mm:ss.SSS [ET]');
  await applicationContext.logger.info('advanced order search', {
    ...omit(rawSearch, 'entityName'),
    size: results.length,
    timestamp,
    userId: authorizedUser.userId,
  });

  const filteredResults = caseSearchFilter(results, authorizedUser).slice(
    0,
    MAX_SEARCH_RESULTS,
  );

  return InternalDocumentSearchResult.validateRawCollection(filteredResults, {
    applicationContext,
  });
};
