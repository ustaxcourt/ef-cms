/**
 * calls history.back()
 * @returns {void}
 */

export const navigateBackAction = ({ router }: ActionProps) => {
  router.back();
};
