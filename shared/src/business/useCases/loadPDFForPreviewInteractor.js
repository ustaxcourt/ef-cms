/**
 * loadPDFForPreviewInteractor
 *
 * @param {string} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.docketEntryId the docket entry id
 * @returns {Promise<object>} the document data
 */
exports.loadPDFForPreviewInteractor = async (
  applicationContext,
  { docketEntryId, docketNumber },
) => {
  try {
    return await applicationContext.getPersistenceGateway().getDocument({
      applicationContext,
      docketNumber,
      key: docketEntryId,
    });
  } catch (err) {
    applicationContext.logger.error(
      `error loading PDF for preview with docketEntryId ${docketEntryId}`,
      err,
    );
    throw new Error('error loading PDF for preview');
  }
};
