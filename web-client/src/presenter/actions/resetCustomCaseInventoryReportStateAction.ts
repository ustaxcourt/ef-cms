import { cloneDeep } from 'lodash';
import { initialCustomCaseInventoryReportState } from '../customCaseInventoryReportState';
import { state } from 'cerebral';

/**
 * resets the custom case inventory report to the initial state
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting showModal
 */
export const resetCustomCaseInventoryReportStateAction = ({ store }) => {
  store.set(
    state.customCaseInventory,
    cloneDeep(initialCustomCaseInventoryReportState),
  );
};
