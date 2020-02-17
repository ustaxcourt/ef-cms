/**
 * set the success message in props for successful consolidation of cases
 *
 * @returns {object} the props with the message
 */
export const setAddConsolidatedCaseSuccessMessageAction = () => {
  return {
    alertSuccess: {
      message:
        'You can view your updates to the consolidated cases below under Case Information',
      title: 'Your Changes Have Been Saved',
    },
  };
};
