import { state } from '@web-client/presenter/app.cerebral';

export const removePetitionerRowAction = ({ get, props, store }) => {
  const petitionerRows = get(state.minuteSheetForm.petitioners.petitioners);

  const filteredPetitionerRows = petitionerRows.filter(
    obj => obj.renderKey !== props.renderKey,
  );

  store.set(
    state.minuteSheetForm.petitioners.petitioners,
    filteredPetitionerRows,
  );
};
