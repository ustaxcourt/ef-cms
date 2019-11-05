/**
 * creates the default success alert object
 *
 * @returns {object} the alertSuccess object with default strings
 */
export const getCreateCaseAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message:
        'Your receipt will appear under the Case Information tab in your case once your petition is processed by the court.',
      title: 'Your petition has been successfully submitted.',
    },
  };
};
