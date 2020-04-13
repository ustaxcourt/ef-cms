/**
 * get alert message when a docket entry's meta is updated
 *
 * @returns {object} the prop of the alert success message
 */
export const getEditDocketEntryMetaAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message: 'Docket entry changes saved.',
    },
  };
};
