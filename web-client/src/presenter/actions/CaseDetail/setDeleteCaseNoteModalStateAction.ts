import { state } from '@web-client/presenter/app.cerebral';

/**
 * set the state for the delete notes modal
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const setDeleteCaseNoteModalStateAction = ({
  get,
  store,
}: ActionProps) => {
  const { docketNumber } = get(state.caseDetail);
  store.set(state.modal.docketNumber, docketNumber);
};
