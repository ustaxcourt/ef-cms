import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the default case type to display to open
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.store the cerebral store object
 * @returns {void}
 */
export const setDefaultCaseTypeToDisplayAction = ({
  applicationContext,
  store,
}: ActionProps) => {
  const { EXTERNAL_USER_DASHBOARD_TABS } = applicationContext.getConstants();
  store.set(state.openClosedCases.caseType, EXTERNAL_USER_DASHBOARD_TABS.OPEN);
};
