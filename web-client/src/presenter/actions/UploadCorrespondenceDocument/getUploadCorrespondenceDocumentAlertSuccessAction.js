/**
 * get alert message when a court document is uploaded
 *
 * @returns {object} the prop of the alert success message
 */
export const getUploadCorrespondenceDocumentAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message: 'Document added to Correspondence Files.',
    },
  };
};
