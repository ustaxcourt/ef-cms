import { state } from 'cerebral';

/**
 * show the file upload status modal
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the store where we register our modal request
 */
export const openFileUploadErrorModal = async ({ store }) => {
  store.set(state.showModal, 'FileUploadErrorModal');
};
