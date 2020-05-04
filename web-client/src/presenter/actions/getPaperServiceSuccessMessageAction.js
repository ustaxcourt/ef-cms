/**
 * returns alertSuccess message for paper service
 *
 * @returns {object} the paper service success message
 */
export const getPaperServiceSuccessMessageAction = () => {
  return {
    alertSuccess: {
      message:
        'This document has been served. Remember to print all documents for parties with paper service.',
    },
  };
};
