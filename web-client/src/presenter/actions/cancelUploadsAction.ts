/**
 * Cancels all uploads in progress, returning to dashboard.
 */
export const cancelUploadsAction = ({ router }: ActionProps) => {
  // go back to dashboard
  router.externalRoute('/');
};
