/**
 * get alert message when a practitioner document is edited successfully
 *
 * @returns {object} the prop of the alert success message
 */
export const getEditPractitionerDocumentAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message: 'The document has been updated.',
    },
  };
};
