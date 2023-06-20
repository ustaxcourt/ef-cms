import { state } from '@web-client/presenter/app.cerebral';

/**
 * show the file upload status modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the store where we register our modal request
 */
export const openFileUploadErrorModal = ({ store }) => {
  store.set(state.modal.showModal, 'FileUploadErrorModal');
};
