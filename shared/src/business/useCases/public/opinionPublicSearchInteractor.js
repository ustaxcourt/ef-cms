const { DocumentSearch } = require('../../entities/documents/DocumentSearch');
const { OPINION_EVENT_CODES } = require('../../entities/EntityConstants');

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
  endDateDay,
  endDateMonth,
  endDateYear,
  judge,
  keyword,
  opinionType,
  startDateDay,
  startDateMonth,
  startDateYear,
}) => {
  const opinionSearch = new DocumentSearch({
    caseTitleOrPetitioner,
    docketNumber,
    endDateDay,
    endDateMonth,
    endDateYear,
    judge,
    keyword,
    opinionType,
    startDateDay,
    startDateMonth,
    startDateYear,
  });

  const rawSearch = opinionSearch.validate().toRawObject();

  return await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: OPINION_EVENT_CODES,
      judgeType: 'judge',
      ...rawSearch,
    });
};
