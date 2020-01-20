/**
 * get alert message when a docket record entry is updated
 *
 * @returns {object} the prop of the alert success message
 */
export const getEditDocketRecordEntryAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message: 'You can view your updates to the Docket Record below.',
      title: 'Your  Changes Have Been Saved.',
    },
  };
};
