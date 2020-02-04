/**
 * get alert message when a court document is uploaded
 *
 * @returns {object} the prop of the alert success message
 */
export const getUploadCourtIssuedDocumentAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message:
        'You can access your documents at any time from draft documents.',
      title: 'Your filing has been successfully submitted.',
    },
  };
};
