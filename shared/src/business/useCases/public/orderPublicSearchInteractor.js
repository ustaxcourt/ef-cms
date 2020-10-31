const { DocumentSearch } = require('../../entities/documents/DocumentSearch');
const { ORDER_EVENT_CODES } = require('../../entities/EntityConstants');
const { PublicDocketEntry } = require('../../entities/cases/PublicDocketEntry');

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

  const orders = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      ...rawSearch,
      documentEventCodes: ORDER_EVENT_CODES,
      judgeType: 'signedJudgeName',
      omitSealed: true,
    });

  return PublicDocketEntry.validateRawCollection(orders, {
    applicationContext,
  });
};
