const { Document } = require('../../entities/Document');
const { DocumentSearch } = require('../../entities/documents/DocumentSearch');

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
  endDateDay,
  endDateMonth,
  endDateYear,
  judge,
  keyword,
  startDateDay,
  startDateMonth,
  startDateYear,
}) => {
  const orderSearch = new DocumentSearch({
    caseTitleOrPetitioner,
    docketNumber,
    endDateDay,
    endDateMonth,
    endDateYear,
    judge,
    keyword,
    startDateDay,
    startDateMonth,
    startDateYear,
  });

  const rawSearch = orderSearch.validate().toRawObject();

  const results = await applicationContext
    .getPersistenceGateway()
    .orderKeywordSearch({
      applicationContext,
      orderEventCodes: Document.ORDER_DOCUMENT_TYPES,
      ...rawSearch,
    });

  const filteredResults = results.filter(item => !item.isSealed);

  return filteredResults;
};
