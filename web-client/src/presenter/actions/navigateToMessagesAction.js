/**
 * changes the route to messages, which is "/case-messages/my/inbox"
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */
export const navigateToMessagesAction = async ({ router }) => {
  await router.route('/case-messages/my/inbox');
};
