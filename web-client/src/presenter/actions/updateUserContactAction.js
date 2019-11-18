/**
 * updates primary contact information
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @returns {object} alertSuccess, caseId, tab
 */
export const updateUserContactAction = async ({ applicationContext, path }) => {
  const { contact, userId } = applicationContext.getCurrentUser();

  try {
    await applicationContext
      .getUseCases()
      .updateUserContactInformationInteractor({
        applicationContext,
        contactInfo: contact,
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
      message:
        'It may take several minutes for all of your cases to display the updated information.',
      title: 'Your contact information has been updated.',
    },
  });
};
