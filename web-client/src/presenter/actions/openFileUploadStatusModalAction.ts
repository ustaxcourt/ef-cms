import { state } from 'cerebral';

/**
 * show the file upload status modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {Function} providers.get the cerebral get function
 */
export const openFileUploadStatusModalAction = ({ store }) => {
  store.set(state.modal.showModal, 'FileUploadStatusModal');
};
