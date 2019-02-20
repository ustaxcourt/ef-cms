import { state } from 'cerebral';

/**
 * sets the state.showSaveSuccess to true which is used for showing the green success text.
 *
 * @param {Object} providers the providers object
 * @param {Function} providers.store the cerebral store used for setting the state.showSaveSuccess
 */
export default ({ store }) => {
  store.set(state.form.showSaveSuccess, true);
};
