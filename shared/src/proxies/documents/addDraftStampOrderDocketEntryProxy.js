const { post } = require('../requests');

/**
 * addDraftStampOrderDocketEntryInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case on which to save the document
 * @param {string} providers.formattedDraftDocumentTitle the formatted draft document title of the document
 * @param {string} providers.originalDocketEntryId the id of the original (un-stamped) document
 * @param {string} providers.stampedDocketEntryId the id of the stamped document
 * @param {string} providers.stampData the stampData from the form to add to the draft order
 * @returns {Promise<*>} the promise of the api call
 */
exports.addDraftStampOrderDocketEntryInteractor = (
  applicationContext,
  {
    docketNumber,
    formattedDraftDocumentTitle,
    originalDocketEntryId,
    stampData,
    stampedDocketEntryId,
  },
) => {
  return post({
    applicationContext,
    body: {
      formattedDraftDocumentTitle,
      stampData,
      stampedDocketEntryId,
    },
    endpoint: `/case-documents/${docketNumber}/${originalDocketEntryId}/stamp`,
  });
};
