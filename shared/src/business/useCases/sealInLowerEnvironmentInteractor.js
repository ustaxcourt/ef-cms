/**
 * sealInLowerEnvironmentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketEntryId the unique identifier of a docket entry on a case
 * @param {string} providers.docketNumber the unique identifier of a case
 * @returns {Promise<object>} the updated data
 */
exports.sealInLowerEnvironmentInteractor = async (
  applicationContext,
  { docketEntryId, docketNumber },
) => {
  if (docketEntryId && docketNumber) {
    // TODO: once we can seal document: https://github.com/flexion/ef-cms/issues/4252
    // return await applicationContext
    //   .getUseCases()
    //   .sealDocumentInteractor(applicationContext, {
    //     docketEntryId,
    //     docketNumber,
    //   });
  } else if (docketNumber) {
    return await applicationContext
      .getUseCases()
      .sealCaseInteractor(applicationContext, {
        docketNumber,
      });
  }

  applicationContext.logger.warn(
    'Did not receive a valid docketEntryId or docketNumber to seal',
  );
};
