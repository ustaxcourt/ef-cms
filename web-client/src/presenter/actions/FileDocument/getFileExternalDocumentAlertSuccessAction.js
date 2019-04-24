/**
 * creates the default success alert object
 *
 * @returns {Object} the alertSuccess object with default strings
 */
export const getFileExternalDocumentAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message:
        'You can access your documents at any time from the docket record below.',
      title: 'Your filing has been successfully submitted.',
    },
  };
};
