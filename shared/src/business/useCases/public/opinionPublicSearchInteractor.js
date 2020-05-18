const { Document } = require('../../entities/Document');
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
  endDateDay,
  endDateMonth,
  endDateYear,
  judge,
  keyword,
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
    startDateDay,
    startDateMonth,
    startDateYear,
  });

  const rawSearch = opinionSearch.validate().toRawObject();

  return await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: Document.OPINION_DOCUMENT_TYPES,
      judgeType: 'judge',
      ...rawSearch,
    });
};
