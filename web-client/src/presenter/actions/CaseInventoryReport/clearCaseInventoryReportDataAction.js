import { state } from 'cerebral';

/**
 * clears the case inventory report data
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const clearCaseInventoryReportDataAction = ({ store }) => {
  store.unset(state.caseInventoryReportData);
  store.set(state.screenMetadata.page, 1);
};
