import { state } from '@web-client/presenter/app.cerebral';

export const setAddedDocketNumbersAction = ({ get, store }: ActionProps) => {
  const documentToEdit = get(state.documentToEdit);
  store.set(
    state.addedDocketNumbers,
    documentToEdit.draftOrderState.addedDocketNumbers,
  );
};
