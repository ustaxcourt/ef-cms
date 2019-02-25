/**
 * returns a generic success alert for when a file is successfully uploaded.
 *
 * @returns {Object} the alertSuccess object containing the generic messages.
 */
export const getFileDocumentAlertSuccessAction = () => {
  return {
    alertSuccess: {
      title: 'Your document was uploaded successfully.',
      message: 'Your document has been filed.',
    },
  };
};
