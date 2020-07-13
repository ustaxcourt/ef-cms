/**
 * get alert message when a correspondence fails to delete
 *
 * @returns {object} the prop of the alert error message
 */
export const getDeleteCorrespondenceDocumentAlertErrorAction = () => {
  return {
    alertError: {
      title:
        'An error occurred when attempting to delete the correspondence document.',
    },
  };
};
