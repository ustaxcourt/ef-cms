/**
 * creates the default success alert object
 *
 * @returns {object} the alertSuccess object with default strings
 */
export const getCreateCaseAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message:
        'Petition filed. Your receipt will be available once your petition is processed.',
    },
  };
};
