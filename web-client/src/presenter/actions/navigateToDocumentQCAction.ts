/**
 * changes the route to /document-qc
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */
export const navigateToDocumentQCAction = async ({ router }: ActionProps) => {
  await router.route('/document-qc/my/inbox');
};
