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
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
} = require('../../business/entities/EntityConstants');
const { formatNow, FORMATS } = require('../utilities/DateHandler');
const { omit } = require('lodash');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * opinionAdvancedSearchInteractor
 *
 * @param {object} applicationContext api applicationContext
 * @param {object} providers providers object
 * @param {object} providers.keyword keyword used for searching opinions
 * @returns {object} the opinions data
 */
exports.opinionAdvancedSearchInteractor = async (
  applicationContext,
  {
    caseTitleOrPetitioner,
    dateRange,
    docketNumber,
    endDate,
    judge,
    keyword,
    // todo: rename to selected/filterby opion types
    opinionTypes,
    startDate,
  },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADVANCED_SEARCH)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const opinionSearch = new DocumentSearch({
    caseTitleOrPetitioner,
    dateRange,
    docketNumber,
    endDate,
    judge,
    keyword,
    startDate,
  });

  const rawSearch = opinionSearch.validate().toRawObject();

  const { results, totalCount } = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: opinionTypes,
      isOpinionSearch: true,
      ...rawSearch,
    });

  const timestamp = formatNow(FORMATS.LOG_TIMESTAMP);
  await applicationContext.logger.info('private opinion search', {
    ...omit(rawSearch, 'entityName'),
    timestamp,
    totalCount,
    userId: authorizedUser.userId,
    userRole: authorizedUser.role,
  });

  const filteredResults = results.slice(0, MAX_SEARCH_RESULTS);

  return InternalDocumentSearchResult.validateRawCollection(filteredResults, {
    applicationContext,
  });
};
