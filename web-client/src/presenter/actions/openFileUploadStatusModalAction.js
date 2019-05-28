import { state } from 'cerebral';

/**
 * show the file upload status modal
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.router the riot.router object that is used for changing the route
 * @param {Function} providers.get the cerebral get function used for getting the path to navigate to in state.path
 */
export const openFileUploadStatusModalAction = async ({ store }) => {
  store.set(state.showModal, 'FileUploadStatusModal');
};
