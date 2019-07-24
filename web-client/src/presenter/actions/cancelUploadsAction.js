/**
 * Cancels all uploads in progress, returning to dashboard.
 */
export const cancelUploadsAction = () => {
  // go back to dashboard
  window.location.replace('/');
};
