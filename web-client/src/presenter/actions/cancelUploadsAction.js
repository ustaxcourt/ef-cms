/**
 * Cancels all uploads in progress, returning to dashboard.
 */
export const cancelUploadsAction = ({ router }) => {
  // go back to dashboard
  router.externalRoute('/');
};
