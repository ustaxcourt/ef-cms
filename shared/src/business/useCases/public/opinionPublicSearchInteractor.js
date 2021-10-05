const {
  MAX_SEARCH_RESULTS,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
} = require('../../entities/EntityConstants');
const {
  PublicDocumentSearchResult,
} = require('../../entities/documents/PublicDocumentSearchResult');
const { DocumentSearch } = require('../../entities/documents/DocumentSearch');

/**
 * opinionPublicSearchInteractor
 *
 * @param {object} applicationContext application context object
 * @param {object} providers the providers object
 * @param {string} providers.caseTitleOrPetitioner case title or petitioner to search for
 * @param {string} providers.docketNumber docket number
 * @param {string} providers.endDate ending date for date range
 * @param {string} providers.judge judge name to filter by
 * @param {string} providers.keyword keyword to search for
 * @param {string} providers.opinionType opinion type to filter by
 * @param {string} providers.startDate start date for date range
 * @returns {object} the opinion search results
 */
exports.opinionPublicSearchInteractor = async (
  applicationContext,
  {
    caseTitleOrPetitioner,
    dateRange,
    docketNumber,
    endDate,
    judge,
    keyword,
    opinionType,
    startDate,
  },
) => {
  const opinionSearch = new DocumentSearch({
    caseTitleOrPetitioner,
    dateRange,
    docketNumber,
    endDate,
    judge,
    keyword,
    opinionType,
    startDate,
  });

  const rawSearch = opinionSearch.validate().toRawObject();

  const results = (
    await applicationContext.getPersistenceGateway().advancedDocumentSearch({
      applicationContext,
      ...rawSearch,
      documentEventCodes: OPINION_EVENT_CODES_WITH_BENCH_OPINION,
      isOpinionSearch: true,
    })
  ).results.slice(0, MAX_SEARCH_RESULTS);

  return PublicDocumentSearchResult.validateRawCollection(results, {
    applicationContext,
  });
};
