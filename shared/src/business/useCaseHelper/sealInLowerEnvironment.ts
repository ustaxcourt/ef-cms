/**
 * sealInLowerEnvironment
 *
 * @param {object} applicationContext the application context
 * @param {array} records an array of docketNumbers and/or docketEntryIds to seal
 * @returns {Promise<array>} the array of responses from the interactor
 */
export const sealInLowerEnvironment = async (applicationContext, records) => {
  const isCurrentColorActive =
    await applicationContext.isCurrentColorActive(applicationContext);

  if (!isCurrentColorActive) {
    return records.map(() => {});
  }

  return Promise.all(
    records.map(record => {
      const { docketEntryId, docketNumber } = record;
      if (docketEntryId && docketNumber) {
        // TODO: once we can seal document: https://github.com/flexion/ef-cms/issues/4252
        // return await applicationContext
        //   .getUseCases()
        //   .sealDocumentInteractor(applicationContext, {
        //     docketEntryId,
        //     docketNumber,
        //   });
      } else if (docketNumber) {
        return applicationContext
          .getUseCases()
          .sealCaseInteractor(applicationContext, {
            docketNumber,
          });
      }

      applicationContext.logger.warn(
        'Did not receive a valid docketEntryId or docketNumber to seal',
        { record },
      );
    }),
  );
};
