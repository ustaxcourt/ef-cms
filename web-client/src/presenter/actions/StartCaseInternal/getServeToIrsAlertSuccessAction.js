/**
 * get alert message when a petition is served
 *
 * @returns {object} the prop of the alert success message
 */
export const getServeToIrsAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message: 'The case has been created and served to the IRS.',
      title: 'The petition has been successfully submitted.',
    },
  };
};
