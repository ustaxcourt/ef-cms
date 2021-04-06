/**
 * Verify uploaded PDFs
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if verification was successful or not
 */
export const verifyPdfsAction = async ({ applicationContext, path }) => {
  try {
    await applicationContext.getUseCases().verifyPdfsInteractor({
      applicationContext,
    });

    return path.success();
  } catch (e) {
    return path.error({
      alertError: {
        title: 'Error verifying PDFs on attempted upload',
      },
    });
  }
};
