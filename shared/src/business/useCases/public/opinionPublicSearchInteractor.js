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
  keyword,
}) => {
  const opinionSearch = new DocumentSearch({
    keyword,
  });

  const rawSearch = opinionSearch.validate().toRawObject();

  return await applicationContext.getPersistenceGateway().opinionKeywordSearch({
    applicationContext,
    opinionEventCodes: Document.OPINION_DOCUMENT_TYPES,
    ...rawSearch,
  });
};
