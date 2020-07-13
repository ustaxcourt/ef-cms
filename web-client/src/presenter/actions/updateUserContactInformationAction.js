import { state } from 'cerebral';

/**
 * updates primary contact information
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the next path in the sequence to call
 * @returns {object} alertSuccess, caseId, tab
 */
export const updateUserContactInformationAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const formUser = get(state.form);
  const currentUser = applicationContext.getCurrentUser();
  try {
    await applicationContext
      .getUseCases()
      .updateUserContactInformationInteractor({
        applicationContext,
        contactInfo: formUser.contact,
        userId: currentUser.userId,
      });
  } catch (err) {
    if (
      err.originalError &&
      err.originalError.response &&
      err.originalError.response.data &&
      err.originalError.response.data.includes(
        'there were no changes found needing to be updated',
      )
    ) {
      return path.noChange();
    } else {
      throw err;
    }
  }

  // TODO: refactor and use web sockets to redirect back to dashboard?
  // we wait 2 seconds because we are hitting an "async: true" endpoint which means we will get a response
  // back instantly which means the user's address on the dashboard might not be updated yet.
  await new Promise(resolve => setTimeout(resolve, 2000));

  return path.success({
    alertSuccess: {
      message:
        'Contact information updated. It may take several minutes for all of your cases to display the updated information.',
    },
  });
};
