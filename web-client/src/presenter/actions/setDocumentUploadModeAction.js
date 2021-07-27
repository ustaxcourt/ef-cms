import { state } from 'cerebral';
/**
 *  returns a callback function that sets the value of state.currentViewMetadata.documentUploadMode
 *
 * @param {string} documentUploadMode the value of documentUploadMode to be set
 * @returns {Function} returns a callback function that sets currentViewMetadata.documentUploadMode on state
 */
export const setDocumentUploadModeAction =
  documentUploadMode =>
  /**
   * sets the value of state.currentViewMetadata.documentUploadMode entry to the value passed in
   *
   * @param {object} providers the providers object
   * @param {object} providers.store the cerebral store object
   */
  ({ props, store }) => {
    store.set(
      state.currentViewMetadata.documentUploadMode,
      props.documentUploadMode || documentUploadMode,
    );
  };
