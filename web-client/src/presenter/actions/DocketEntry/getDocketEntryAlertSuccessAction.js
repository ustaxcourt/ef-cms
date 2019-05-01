/**
 * creates the default success alert object
 *
 * @returns {Object} the alertSuccess object with default strings
 */
export const getDocketEntryAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message: 'You can view your entries in the docket record table below.',
      title: 'Your docket entry is complete.',
    },
  };
};
