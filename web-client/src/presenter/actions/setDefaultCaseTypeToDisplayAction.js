import { state } from 'cerebral';

/**
 * sets the default case type to display to open
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @returns {void}
 */
export const setDefaultCaseTypeToDisplayAction = ({ store }) => {
  store.set(
    state.openClosedCases.caseType,
    state.constants.EXTERNAL_USER_DASHBOARD_TABS.OPEN,
  );
};
