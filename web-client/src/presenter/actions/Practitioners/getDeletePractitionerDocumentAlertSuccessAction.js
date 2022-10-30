/**
 * get alert message when a practitioner document is deleted successfully
 *
 * @returns {object} the prop of the alert success message
 */
export const getDeletePractitionerDocumentAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message: 'The document has been deleted.',
    },
  };
};
