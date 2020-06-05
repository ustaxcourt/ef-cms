/**
 * fetches the inbox case messages for the section
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{CaseMessage: Array}>} a list of messages
 */
export const getInboxCaseMessagesForSectionAction = async ({
  applicationContext,
}) => {
  const messages = await applicationContext
    .getUseCases()
    .getInboxCaseMessagesForSectionInteractor({
      applicationContext,
      section: applicationContext.getCurrentUser().section,
    });

  return { messages };
};
