/**
 * get alert message when a correspondence is successfully deleted
 *
 * @returns {object} the prop of the alert success message
 */
export const getDeleteCorrespondenceDocumentAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message: 'Document removed from Correspondence Files.',
    },
  };
};
