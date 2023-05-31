import { state } from 'cerebral';

/**
 * clear value of state.correspondenceId
 *
 * @param {object} providers.store the cerebral store object
 */
export const unsetCorrespondenceDocumentViewerIdAction = ({
  store,
}: ActionProps) => {
  store.unset(state.correspondenceId);
};
