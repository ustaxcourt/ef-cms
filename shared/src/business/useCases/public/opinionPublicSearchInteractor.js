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
 * @param {object} providers the providers object containing applicationContext, keyword
 * @param {object} providers.applicationContext application context object
 * @returns {object} the opinion search results
 */
exports.opinionPublicSearchInteractor = async ({
  applicationContext,
  caseTitleOrPetitioner,
  docketNumber,
  endDate,
  judge,
  keyword,
  opinionType,
  startDate,
}) => {
  const opinionSearch = new DocumentSearch({
    caseTitleOrPetitioner,
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
      judgeType: 'judge',
    })
  ).results.slice(0, MAX_SEARCH_RESULTS);

  return PublicDocumentSearchResult.validateRawCollection(results, {
    applicationContext,
  });
};
