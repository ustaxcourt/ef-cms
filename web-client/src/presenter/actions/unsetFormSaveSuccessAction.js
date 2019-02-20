import { state } from 'cerebral';

/**
 * sets the state.form.showSaveSuccess to false
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store used for setting state.form.showSaveSuccess
 */
export default ({ store }) => {
  store.set(state.form.showSaveSuccess, false);
};
