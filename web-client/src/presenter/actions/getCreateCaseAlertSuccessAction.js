/**
 * creates the default success alert object
 *
 * @returns {object} the alertSuccess object with default strings
 */
export const getCreateCaseAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message:
        'Your petition receipt will appear in the case information tab on the docket once processed by the court.',
      title: 'Your petition has been successfully submitted.',
    },
  };
};
