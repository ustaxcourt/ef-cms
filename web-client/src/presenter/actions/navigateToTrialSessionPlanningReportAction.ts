/**
 * changes the route to trial-session-planning-report
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */
export const navigateToTrialSessionPlanningReportAction = async ({
  router,
}: ActionProps) => {
  await router.route('/trial-session-planning-report');
};
