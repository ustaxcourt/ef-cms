import { state } from 'cerebral';

/**
 * set the state error
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const setNoCaseFoundModalSearchAction = ({ store }) => {
  store.set(state.modal.error, 'No Case Found');
  store.unset(state.modal.caseDetail);
};
