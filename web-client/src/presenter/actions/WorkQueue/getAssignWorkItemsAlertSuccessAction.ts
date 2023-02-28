/**
 * creates the success alert object for assigning work items
 *
 * @returns {object} the alertSuccess object props
 */
export const getAssignWorkItemsAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message: 'Selected documents assigned.',
    },
  };
};
