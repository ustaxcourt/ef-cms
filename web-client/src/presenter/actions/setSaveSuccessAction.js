import { state } from 'cerebral';

/**
 * sets the state.screenMetadata.showSaveSuccess to true which is used for showing the green success text.
 *
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store used for setting the state.screenMetadata.showSaveSuccess
 */
export const setSaveSuccessAction = ({ store }) => {
  store.set(state.screenMetadata.showSaveSuccess, true);
};
