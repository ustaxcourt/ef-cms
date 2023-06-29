import { state } from '@web-client/presenter/app.cerebral';

/**
 * clear the value of state.documentToEdit
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const setAddedDocketNumbersAction = ({ get, store }: ActionProps) => {
  const documentToEdit = get(state.documentToEdit);
  store.set(
    state.addedDocketNumbers,
    documentToEdit.draftOrderState.addedDocketNumbers,
  );
};
