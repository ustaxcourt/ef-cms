/**
 * returns a generic success alert for when a file is successfully uploaded.
 *
 * @returns {object} the alertSuccess object containing the generic messages.
 */
export const getFileDocumentAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message: 'Your document has been filed.',
      title: 'Your document was uploaded successfully.',
    },
  };
};
