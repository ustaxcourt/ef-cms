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
} = require('../../business/entities/EntityConstants');
const { caseSearchFilter } = require('../utilities/caseFilter');
const { formatNow, FORMATS } = require('../../business/utilities/DateHandler');
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
    dateRange,
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

  console.log('docketNumber', docketNumber);
  const isAssociated = await applicationContext
    .getPersistenceGateway()
    .verifyCaseForUser({
      applicationContext,
      docketNumber,
      userId: authorizedUser.userId,
    });

  const canViewSealedCase = isAuthorized(
    authorizedUser,
    ROLE_PERMISSIONS.VIEW_SEALED_CASE,
  );

  console.log(
    'canViewSealedCase in orderAdvancedSearchInteractor:',
    canViewSealedCase,
  );
  console.log(
    '~~ isAssociated in orderAdvancedSearchInteractor: ',
    isAssociated,
  );

  let omitSealed = false;
  if (!canViewSealedCase && !isAssociated) {
    omitSealed = true;
  }

  console.log('omitSealed [we want it to be false]...', omitSealed);

  const orderSearch = new DocumentSearch({
    caseTitleOrPetitioner,
    dateRange,
    docketNumber,
    endDate,
    from,
    judge,
    keyword,
    startDate,
    userRole: authorizedUser.role,
  });

  const rawSearch = orderSearch.validate().toRawObject();

  const { results, totalCount } = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: ORDER_EVENT_CODES,
      isOpinionSearch: false,
      omitSealed,
      ...rawSearch,
    });

  console.log(
    'results',
    results.map(r => `${r.docketNumber}, ${r.documentTitle}`),
  );

  const timestamp = formatNow(FORMATS.LOG_TIMESTAMP);
  await applicationContext.logger.info('private order search', {
    ...omit(rawSearch, 'entityName'),
    timestamp,
    totalCount,
    userId: authorizedUser.userId,
    userRole: authorizedUser.role,
  });

  const filteredResults = caseSearchFilter(results, authorizedUser).slice(
    0,
    MAX_SEARCH_RESULTS,
  );

  console.log('filteredResults [should have results]', filteredResults);

  return InternalDocumentSearchResult.validateRawCollection(filteredResults, {
    applicationContext,
  });
};
