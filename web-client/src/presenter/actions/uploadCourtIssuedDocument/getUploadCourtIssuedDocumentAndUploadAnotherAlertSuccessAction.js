/**
 * get alert message when a court document is uploaded
 * and another entry will be added
 *
 * @returns {object} the prop of the alert success message
 */
export const getUploadCourtIssuedDocumentAndUploadAnotherAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message: 'Continue adding document entries below.',
      title: 'Your entry has been added to draft documents.',
    },
  };
};
