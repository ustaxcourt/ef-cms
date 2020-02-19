/**
 * changes the route to view the review-petition
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */
export const navigateToReviewPetitionFromPaperAction = async ({ router }) => {
  await router.route('file-a-petition/review-petition');
};
