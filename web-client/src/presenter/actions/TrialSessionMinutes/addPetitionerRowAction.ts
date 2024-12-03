import { state } from '@web-client/presenter/app.cerebral';
import { v4 as uuidv4 } from 'uuid';

export const addPetitionerRowAction = ({ get, store }) => {
  const petitionerRows = get(state.minuteSheetForm.petitioners.petitioners);
  petitionerRows.push({
    renderKey: uuidv4(),
    name: '',
    datesOfAppearence: '',
  });
  store.set(state.minuteSheetForm.petitioners.petitioners, petitionerRows);
};
