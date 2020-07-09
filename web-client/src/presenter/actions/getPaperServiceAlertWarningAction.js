/**
 * sets the alertError on props for paper service warning
 *
 * @returns {object} the alertWarning
 */
export const getPaperServiceAlertWarningAction = () => {
  return {
    alertWarning: {
      message:
        'This document has not been electronically served. Print and mail to complete paper service.',
    },
  };
};
