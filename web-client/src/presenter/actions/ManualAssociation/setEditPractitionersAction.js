import { cloneDeep } from 'lodash';
import { state } from 'cerebral';

/**
 * sets up the modal state for the Edit Practitioners modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.store the cerebral store object
 * @returns {Promise<*>} the promise of the completed action
 */
export const setEditPractitionersAction = async ({ get, store }) => {
  const practitioners = get(state.caseDetail.practitioners);
  store.set(state.modal.practitioners, cloneDeep(practitioners));
};
