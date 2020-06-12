/**
 * get alert message when a correspondence is successfully updated
 *
 * @returns {object} the prop of the alert success message
 */
export const getEditCorrespondenceDocumentAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message: 'Correspondence has been successfully updated.',
    },
  };
};
