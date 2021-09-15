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
    opinionTypes,
    startDate,
  });

  const rawSearch = opinionSearch.validate().toRawObject();

  const results = (
    await applicationContext.getPersistenceGateway().advancedDocumentSearch({
      applicationContext,
      documentEventCodes: OPINION_EVENT_CODES_WITH_BENCH_OPINION,
      judgeType: 'judge',
      ...rawSearch,
    })
  ).results.slice(0, MAX_SEARCH_RESULTS);

  return InternalDocumentSearchResult.validateRawCollection(results, {
    applicationContext,
  });
};
