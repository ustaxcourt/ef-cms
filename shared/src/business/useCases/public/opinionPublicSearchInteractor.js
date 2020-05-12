const { Document } = require('../../entities/Document');
const { OpinionSearch } = require('../../entities/opinions/OpinionSearch');

/**
 * opinionPublicSearchInteractor
 *
 * @param {object} providers the providers object containing applicationContext, keyword
 * @param {object} providers.applicationContext application context object
 * @returns {object} the opinion search results
 */
exports.opinionPublicSearchInteractor = async ({
  applicationContext,
  opinionKeyword,
}) => {
  const opinionSearch = new OpinionSearch({
    opinionKeyword,
  });

  const rawSearch = opinionSearch.validate().toRawObject();

  return await applicationContext.getPersistenceGateway().opinionKeywordSearch({
    applicationContext,
    opinionEventCodes: Document.OPINION_DOCUMENT_TYPES,
    ...rawSearch,
  });
};
