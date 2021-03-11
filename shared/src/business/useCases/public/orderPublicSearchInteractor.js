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
 * @param {object} providers the providers object containing caseTitleOrPetitioner, docketNumber, endDate, judge, keyword, startDate
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

  const {
    results,
  } = await applicationContext.getPersistenceGateway().advancedDocumentSearch({
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
