import { state } from 'cerebral';

/**
 * sets the state.screenMetadata.showSaveSuccess to false
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.screenMetadata.showSaveSuccess
 */
export const unsetSaveSuccessAction = ({ store }) => {
  store.set(state.screenMetadata.showSaveSuccess, false);
};
