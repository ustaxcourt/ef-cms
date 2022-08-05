/**
 * generateDraftStampOrderInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.motionDocketEntryId the docket entry id of the original motion
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.parentMessageId the id of the parent message
 * @param {boolean} providers.stampData the stamp data from the form to be applied to the stamp order pdf
 * @param {string} providers.stampedDocketEntryId the docket entry id of the new stamped order docket entry
 */
exports.generateDraftStampOrderInteractor = async (
  applicationContext,
  {
    docketNumber,
    formattedDraftDocumentTitle,
    motionDocketEntryId,
    parentMessageId,
    stampData,
    stampedDocketEntryId,
  },
) => {
  await applicationContext
    .getUseCaseHelpers()
    .addDraftStampOrderDocketEntryInteractor(applicationContext, {
      docketNumber,
      formattedDraftDocumentTitle,
      originalDocketEntryId: motionDocketEntryId,
      parentMessageId,
      stampData,
      stampedDocketEntryId,
    });

  await applicationContext
    .getUseCaseHelpers()
    .generateStampedCoversheetInteractor(applicationContext, {
      docketEntryId: motionDocketEntryId,
      docketNumber,
      stampData,
      stampedDocketEntryId,
    });
};
