const {
  MAX_SEARCH_RESULTS,
  ORDER_EVENT_CODES,
  ORDER_JUDGE_FIELD,
} = require('../../entities/EntityConstants');
const {
  PublicDocumentSearchResult,
} = require('../../entities/documents/PublicDocumentSearchResult');
const { DocumentSearch } = require('../../entities/documents/DocumentSearch');
const { filterForPublic } = require('./publicHelpers');

/**
 * orderPublicSearchInteractor
 *
 * @param {object} applicationContext application context object
 * @param {object} providers the providers object
 * @param {string} providers.caseTitleOrPetitioner case title or petitioner to search for
 * @param {string} providers.docketNumber docket number
 * @param {string} providers.endDate ending date for date range
 * @param {string} providers.judge judge name to filter by
 * @param {string} providers.keyword keyword to search for
 * @param {string} providers.startDate start date for date range
 * @returns {object} the order search results
 */
exports.orderPublicSearchInteractor = async (
  applicationContext,
  { caseTitleOrPetitioner, docketNumber, endDate, judge, keyword, startDate },
) => {
  const orderSearch = new DocumentSearch({
    caseTitleOrPetitioner,
    docketNumber,
    endDate,
    judge,
    keyword,
    startDate,
  });

  const rawSearch = orderSearch.validate().toRawObject();

  const { results } = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      ...rawSearch,
      documentEventCodes: ORDER_EVENT_CODES,
      judgeType: ORDER_JUDGE_FIELD,
      omitSealed: true,
    });

  const filteredResults = (
    await filterForPublic({
      applicationContext,
      unfiltered: results,
    })
  ).slice(0, MAX_SEARCH_RESULTS);

  return PublicDocumentSearchResult.validateRawCollection(filteredResults, {
    applicationContext,
  });
};
