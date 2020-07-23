/**
 * returns alertSuccess message for paper service
 *
 * @returns {object} the paper service success message
 */
export const getPaperServiceSuccessMessageAction = () => {
  return {
    alertSuccess: {
      message: 'Your entry has been added to the docket record.',
    },
  };
};
