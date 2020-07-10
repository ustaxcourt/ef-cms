/**
 * set the success message in props for successful document signing
 *
 * @returns {object} the props with the message
 */
export const setCompleteDocumentSigningSuccessAlertAction = () => {
  return {
    alertSuccess: {
      message: 'Signature added.',
    },
  };
};
