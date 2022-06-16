/**
 * returns the alertSuccess object to display an alert message based
 * on the next step the user chose
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
