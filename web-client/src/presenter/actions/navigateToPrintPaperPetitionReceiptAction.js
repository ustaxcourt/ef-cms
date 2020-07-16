import { state } from 'cerebral';

/**
 * Changes the route url to navigate print paper petition receipt including
 * the current page in the route
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */
export const navigateToPrintPaperPetitionReceiptAction = async ({
  get,
  router,
}) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const currentPage = get(state.currentPage);

  await router.route(
    `/case-detail/${docketNumber}/print-paper-petition-receipt/${currentPage}`,
  );
};
