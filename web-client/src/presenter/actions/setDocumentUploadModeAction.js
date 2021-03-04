import { state } from 'cerebral';
/**
 * fixme
 *  returns a callback function that sets isEditingDocketEntry on state
 *
 * @param {string} isEditingDocketEntry the value of isEditingDocketEntry to be set
 * @returns {Function} returns a callback function that sets isEditingDocketEntry on state
 */
export const setDocumentUploadModeAction = documentUploadMode =>
  /**
   * sets the value of state.isEditingDocket entry to the value passed in
   *
   * @param {object} providers the providers object
   * @param {object} providers.store the cerebral store object
   */
  async ({ props, store }) => {
    store.set(
      state.currentViewMetadata.documentUploadMode,
      props.documentUploadMode || documentUploadMode,
    );
  };
