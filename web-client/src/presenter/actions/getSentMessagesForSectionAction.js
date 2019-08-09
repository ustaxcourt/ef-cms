/**
 * fetches the sent messages for a secton.
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {object} a list of sent work items
 */
export const getSentMessagesForSectionAction = async ({
  applicationContext,
}) => {
  //gets the section from the currently logged in user
  let workItems = await applicationContext
    .getUseCases()
    .getSentMessagesForSectionInteractor({
      applicationContext,
    });
  return { workItems };
};
