import { state } from '@web-client/presenter/app.cerebral';

// evaluate if I should be deleting this action as well
export const setAddedDocketNumbersAction = ({ get, store }: ActionProps) => {
  const documentToEdit = get(state.documentToEdit);
  store.set(
    state.addedDocketNumbers,
    documentToEdit.draftOrderState.addedDocketNumbers,
  );
};
