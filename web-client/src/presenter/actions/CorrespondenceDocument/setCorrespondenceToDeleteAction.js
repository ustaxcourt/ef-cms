import { state } from 'cerebral';

/**
 * set correspondence to delete information.
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setCorrespondenceToDeleteAction = ({ props, store }) => {
  const { correspondenceId, documentTitle } = props;

  store.set(state.modal.correspondenceToDelete.documentTitle, documentTitle);
  store.set(
    state.modal.correspondenceToDelete.correspondenceId,
    correspondenceId,
  );
};
