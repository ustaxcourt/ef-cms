/**
 * set the success message in props for successful document signing and complete
 *
 * @returns {object} the props with the message
 */
export const setSignAndCompleteDocumentSigningSuccessAlertAction = () => {
  return {
    alertSuccess: {
      message:
        'Your document has been successfully created and attached to this message',
    },
  };
};
