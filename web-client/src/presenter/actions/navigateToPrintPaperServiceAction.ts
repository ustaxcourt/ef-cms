import { state } from 'cerebral';

/**
 * changes the route to the printable case confirmation page
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} asynchronous action
 */
export const navigateToPrintPaperServiceAction = async ({ get, router }) => {
  const docketNumber = get(state.caseDetail.docketNumber);

  await router.route(`/print-paper-service/${docketNumber}`);
};
