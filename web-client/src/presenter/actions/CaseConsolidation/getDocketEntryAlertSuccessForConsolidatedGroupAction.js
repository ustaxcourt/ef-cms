/**
 * returns the expected success alert for saving a docket entry to consolidated group
 *
 * @param {object} providers the providers object
 * @returns {object} the alertSuccess object with default strings
 */
export const getDocketEntryAlertSuccessForConsolidatedGroupAction = () => {
  return {
    alertSuccess: {
      message: 'Document saved to selected cases in group.',
    },
  };
};
