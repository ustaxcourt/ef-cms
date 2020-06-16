/**
 * get alert message when a petition is served
 *
 * @returns {object} the prop of the alert success message
 */
export const getServeToIrsAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message: 'Petition served to IRS.',
    },
  };
};
