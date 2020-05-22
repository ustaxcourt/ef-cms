/**
 * get alert message when a correspondence is successfully updated
 *
 * @returns {object} the prop of the alert success message
 */
export const getDeleteCorrespondenceDocumentAlertErrorAction = () => {
  return {
    alertError: {
      title:
        'An error occurred when attempting to delete the correspondence document.',
    },
  };
};
