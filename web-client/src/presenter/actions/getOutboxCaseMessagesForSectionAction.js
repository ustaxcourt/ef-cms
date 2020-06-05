/**
 * fetches the outbox case messages for the section
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{CaseMessage: Array}>} a list of messages
 */
export const getOutboxCaseMessagesForSectionAction = async ({
  applicationContext,
}) => {
  const messages = await applicationContext
    .getUseCases()
    .getOutboxCaseMessagesForSectionInteractor({
      applicationContext,
      section: applicationContext.getCurrentUser().section,
    });

  return { messages };
};
