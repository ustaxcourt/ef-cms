/**
 * creates the success alert object for assigning work items
 *
 * @returns {object} the alertSuccess object with
 */
export const getAssignWorkItemsAlertSuccessAction = () => {
  return {
    alertSuccess: {
      title: 'Selected documents were successfully assigned',
    },
  };
};
