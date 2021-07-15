import { state } from 'cerebral';

/**
 * clear value of state.correspondenceId
 *
 * @param {object} providers.store the cerebral store object
 */
export const unsetCorrespondenceDocumentViewerIdAction = ({ store }) => {
  store.unset(state.correspondenceId);
};
