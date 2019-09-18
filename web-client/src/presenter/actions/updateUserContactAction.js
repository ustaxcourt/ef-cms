import { state } from 'cerebral';

/**
 * updates primary contact information
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {object} providers.get the cerebral store used for getting state.form
 * @returns {object} alertSuccess, caseId, tab
 */
export const updateUserContactAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const userId = get(state.user.userId);
  const contactInfo = get(state.user.contact);

  try {
    await applicationContext
      .getUseCases()
      .updateUserContactInformationInteractor({
        applicationContext,
        contactInfo,
        userId,
      });
  } catch (err) {
    if (
      err.originalError &&
      err.originalError.response.data.indexOf(
        'there were no changes found needing to be updated',
      ) !== -1
    ) {
      return path.noChange();
    } else {
      throw err;
    }
  }

  // we wait 2 seconds because we are hitting an "async: true" endpoint which means we will get a response
  // back instantly which means the user's address on the dashboard might not be updated yet.
  await new Promise(resolve => setTimeout(resolve, 2000));

  return path.success({
    alertSuccess: {
      message: 'Please confirm the information below is correct.',
      title: 'Your changes have been saved.',
    },
  });
};
