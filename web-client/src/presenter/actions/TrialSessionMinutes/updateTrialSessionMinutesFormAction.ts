import { state } from '@web-client/presenter/app.cerebral';
import { v4 as uuidv4 } from 'uuid';

export const updateTrialSessionMinutesFormAction = ({
  props,
  store,
}: ActionProps) => {
  const { name, rowInfo, section, value } = props;

  if (rowInfo && rowInfo.nestedName && rowInfo.key) {
    store.set(
      state.minuteSheetForm[section][name][rowInfo.key][rowInfo.nestedName],
      value,
    );
  } else {
    store.set(state.minuteSheetForm[section][name], value);
  }

  // Handle side-effects of state changes below for the time being, with intent
  // of using a cleaner way of handling these changes.
  if (section === 'petitioners' && name === 'noAppearance') {
    const updatedPetitionersObject = {} as {};

    if (!value) {
      const newRenderKey = uuidv4();
      updatedPetitionersObject[newRenderKey] = {
        datesOfAppreance: '',
        name: '',
        renderKey: newRenderKey,
      };
    }

    store.set(
      state.minuteSheetForm.petitioners.petitioners,
      updatedPetitionersObject,
    );
  }
};
