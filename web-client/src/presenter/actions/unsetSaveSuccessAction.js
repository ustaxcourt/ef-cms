import { state } from 'cerebral';

/**
 * sets the state.screenMetadata.showSaveSuccess to false
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store used for setting state.screenMetadata.showSaveSuccess
 */
export const unsetSaveSuccessAction = ({ store }) => {
  store.set(state.screenMetadata.showSaveSuccess, false);
};
