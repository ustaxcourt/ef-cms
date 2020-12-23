const {
  MAX_SEARCH_RESULTS,
  ORDER_EVENT_CODES,
} = require('../../entities/EntityConstants');
const {
  PublicDocumentSearchResult,
} = require('../../entities/documents/PublicDocumentSearchResult');
const { DocumentSearch } = require('../../entities/documents/DocumentSearch');
const { filterForPublic } = require('./publicHelpers');

/**
 * orderPublicSearchInteractor
 *
 * @param {object} providers the providers object containing applicationContext, keyword, caseTitleOrPetitioner, docketNumber, judge, startDate, endDate
 * @param {object} providers.applicationContext application context object
 * @returns {object} the order search results
 */
exports.orderPublicSearchInteractor = async ({
  applicationContext,
  caseTitleOrPetitioner,
  docketNumber,
  endDate,
  judge,
  keyword,
  startDate,
}) => {
  const orderSearch = new DocumentSearch({
    caseTitleOrPetitioner,
    docketNumber,
    endDate,
    judge,
    keyword,
    startDate,
  });

  const rawSearch = orderSearch.validate().toRawObject();

  const foundDocuments = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      ...rawSearch,
      documentEventCodes: ORDER_EVENT_CODES,
      judgeType: 'signedJudgeName',
      omitSealed: true,
    });

  const filteredResults = (
    await filterForPublic({
      applicationContext,
      unfiltered: foundDocuments,
    })
  ).slice(0, MAX_SEARCH_RESULTS);

  return PublicDocumentSearchResult.validateRawCollection(filteredResults, {
    applicationContext,
  });
};
