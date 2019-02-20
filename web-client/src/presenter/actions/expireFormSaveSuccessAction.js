import { state } from 'cerebral';

/**
 * hides the green success message after clicking save on the edit petition page a short amount of time
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for setting state.form.showSaveSuccess
 */
export default ({ store }) => {
  const EXPIRE_TIMEOUT_MS = 2000;
  setTimeout(() => {
    store.set(state.form.showSaveSuccess, false);
  }, EXPIRE_TIMEOUT_MS);
};
