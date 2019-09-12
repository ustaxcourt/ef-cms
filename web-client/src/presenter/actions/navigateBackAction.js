/**
 * calls history.back()
 *
 * @returns {void}
 *
 */

export const navigateBackAction = () => {
  console.log('history', history);
  history.back();
};
