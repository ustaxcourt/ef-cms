/**
 * fetches the inbox messages for the section
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{Message: Array}>} a list of messages
 */
export const getInboxMessagesForSectionAction = async ({
  applicationContext,
  props,
}) => {
  console.log('getinboxmsgs section props', props);
  const { section: selectedSection } = props;
  // maybe at this point we should get the button that was clicked
  // either petitions or docket section
  // off of props?
  // if the user is CCS role
  const messages = await applicationContext
    .getUseCases()
    .getInboxMessagesForSectionInteractor(applicationContext, {
      section: selectedSection || applicationContext.getCurrentUser().section,
    });

  return { messages };
};
