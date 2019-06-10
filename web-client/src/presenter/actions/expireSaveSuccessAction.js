import { state } from 'cerebral';

/**
 * hides the green success message after clicking save on the edit petition page a short amount of time
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting state.screenMetadata.showSaveSuccess
 */
export const expireSaveSuccessAction = ({ store }) => {
  const EXPIRE_TIMEOUT_MS = 2000;
  setTimeout(() => {
    store.set(state.screenMetadata.showSaveSuccess, false);
  }, EXPIRE_TIMEOUT_MS);
};
