import { state } from '@web-client/presenter/app.cerebral';
import { v4 as uuidv4 } from 'uuid';

export const updateTrialSessionMinutesFormAction = ({
  props,
  store,
}: ActionProps) => {
  const { name, section, value } = props;

  store.set(state.minuteSheetForm[section][name], value);

  // Handle side-effects of state changes below for the time being, with intent
  // of using a cleaner way of handling these changes.
  if (section === 'petitioners' && name === 'noAppearance') {
    const updatedPetitionersArray = [] as any[];

    if (!value) {
      updatedPetitionersArray.push({
        datesOfAppreance: '',
        name: '',
        renderKey: uuidv4(),
      });
    }

    store.set(
      state.minuteSheetForm.petitioners.petitioners,
      updatedPetitionersArray,
    );
  }
};
