/**
 * loadPDFForPreviewInteractor
 *
 * @param {object} obj the params object
 * @param {string} obj.applicationContext the application context
 * @param {string} obj.docketNumber the docket number of the case
 * @param {string} obj.docketEntryId the docket entry id
 * @returns {Promise<object>} the document data
 */
exports.loadPDFForPreviewInteractor = async ({
  applicationContext,
  docketEntryId,
  docketNumber,
}) => {
  try {
    return await applicationContext.getPersistenceGateway().getDocument({
      applicationContext,
      docketNumber,
      key: docketEntryId,
    });
  } catch (err) {
    throw new Error('error loading PDF');
  }
};
