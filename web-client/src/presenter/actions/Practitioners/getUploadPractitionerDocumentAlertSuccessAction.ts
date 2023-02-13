/**
 * get alert message when a court document is uploaded
 *
 * @returns {object} the prop of the alert success message
 */
export const getUploadPractitionerDocumentAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message: 'The file has been added.',
    },
  };
};
