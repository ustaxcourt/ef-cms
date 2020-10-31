const { DocumentSearch } = require('../../entities/documents/DocumentSearch');
const { OPINION_EVENT_CODES } = require('../../entities/EntityConstants');
const { PublicDocketEntry } = require('../../entities/cases/PublicDocketEntry');

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

  const opinions = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      ...rawSearch,
      documentEventCodes: OPINION_EVENT_CODES,
      judgeType: 'judge',
      omitSealed: true,
    });

  return PublicDocketEntry.validateRawCollection(opinions, {
    applicationContext,
  });
};
