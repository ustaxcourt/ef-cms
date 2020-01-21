/**
 * get alert message when a docket entry's meta is updated
 *
 * @returns {object} the prop of the alert success message
 */
export const getEditDocketEntryMetaAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message: 'You can view your updates to the Docket Record below.',
      title: 'Your changes have been saved.',
    },
  };
};
