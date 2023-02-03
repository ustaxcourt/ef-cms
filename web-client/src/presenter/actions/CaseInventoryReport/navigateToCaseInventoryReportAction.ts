/**
 * changes the route to view the case inventory report
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */
export const navigateToCaseInventoryReportAction = async ({ router }) => {
  await router.route('/reports/case-inventory-report');
};
