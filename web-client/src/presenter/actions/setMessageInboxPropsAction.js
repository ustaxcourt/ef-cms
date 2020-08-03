/**
 * sets the props so that message inbox is shown
 *
 * @returns {object} the props for message inbox to show
 */
export const setMessageInboxPropsAction = () => {
  return {
    box: 'inbox',
    queue: 'my',
  };
};
