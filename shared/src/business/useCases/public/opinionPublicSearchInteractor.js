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
  opinionKeyword,
}) => {
  const opinionSearch = new DocumentSearch({
    opinionKeyword,
  });

  const rawSearch = opinionSearch.validate().toRawObject();

  return await applicationContext.getPersistenceGateway().opinionKeywordSearch({
    applicationContext,
    opinionEventCodes: Document.OPINION_DOCUMENT_TYPES,
    ...rawSearch,
  });
};
