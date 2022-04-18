const {
  replaceBracketed,
} = require('../../../business/utilities/replaceBracketed');

/**
 * @param {object} providers the providers object containing applicationContext, caseEntity, document, replacements
 * @param providers.applicationContext api applicationContext
 * @param providers.caseEntity the case to create a new document for
 * @param providers.document a document similar to those defined in SYSTEM_GENERATED_DOCUMENT_TYPES in EntityConstants.js (i.e. must have the same properties)
 * @param providers.replacements an ordered array of strings that replace bracketed placeholders in providers.document.content
 * @returns {Promise<void>} does not return anything, rather creates a document and associated docket entry
 */
const generateDraftDocument = async ({
  applicationContext,
  caseEntity,
  document,
  replacements,
}) => {
  const content = replaceBracketed(document.content, ...replacements);

  await applicationContext
    .getUseCaseHelpers()
    .addDocketEntryForSystemGeneratedOrder({
      applicationContext,
      caseEntity,
      systemGeneratedDocument: {
        ...document,
        content,
      },
    });
};

module.exports = {
  generateDraftDocument,
};
