/**
 * creates the default success alert object
 *
 * @returns {Object} the alertSuccess object with default strings
 */
export const getCreateCaseAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message: 'You can access your case at any time from the case list below.',
      title: 'Your petition has been successfully submitted.',
    },
  };
};
