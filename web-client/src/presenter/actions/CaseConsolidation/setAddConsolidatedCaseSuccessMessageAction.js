/**
 * set the success message in props for successful consolidation of cases
 *
 * @returns {object} the props with the message
 */
export const setAddConsolidatedCaseSuccessMessageAction = () => {
  return {
    alertSuccess: {
      message: 'Selected cases consolidated.',
    },
  };
};
