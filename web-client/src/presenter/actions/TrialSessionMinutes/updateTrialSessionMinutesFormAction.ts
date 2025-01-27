import { BRIEF_TYPE_OPTIONS } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
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
  } else if (rowInfo && rowInfo.key && !rowInfo.nestedName) {
    store.set(state.minuteSheetForm[section][name][rowInfo.key], value);
  } else {
    store.set(state.minuteSheetForm[section][name], value);
  }

  // Handle side-effects of state changes below for the time being, with intent
  // of using a cleaner way of handling these changes.
  if (section === 'petitionersSection' && name === 'noAppearance') {
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
      state.minuteSheetForm.petitionersSection.petitioners,
      updatedPetitionersObject,
    );
  }

  // 10419 TODO refactor away from magic strings
  if (
    section === 'actionsAndFilingsSection' &&
    name === 'actionsAndFilings' &&
    rowInfo.nestedName === 'documentType' &&
    value !== 'motion'
  ) {
    store.unset(state.minuteSheetForm[section][name][rowInfo.key].oralMotion);
    store.unset(state.minuteSheetForm[section][name][rowInfo.key].objection);
  }

  // 10419 TODO refactor away from magic strings
  if (
    section === 'actionsAndFilingsSection' &&
    name === 'actionsAndFilings' &&
    rowInfo.nestedName === 'documentType' &&
    value === 'order'
  ) {
    store.set(
      state.minuteSheetForm[section][name][rowInfo.key].filedBy,
      'court',
    );
  }

  if (section === 'trialBriefSection' && name === 'briefType') {
    const defaultBriefDetailsValuesMap = {
      [BRIEF_TYPE_OPTIONS.seriatimBrief]: {
        answering: {
          dueDate: '',
          note: '',
          partyType: '',
        },
        opening: {
          dueDate: '',
          note: '',
          partyType: '',
        },
        reply: {
          dueDate: '',
          note: '',
          partyType: '',
        },
        surReply: {
          dueDate: '',
          note: '',
          partyType: '',
        },
      },
      [BRIEF_TYPE_OPTIONS.seriatimMemorandum]: {
        answering: {
          dueDate: '',
          note: '',
          partyType: '',
        },
        opening: {
          dueDate: '',
          note: '',
          partyType: '',
        },
        reply: {
          dueDate: '',
          note: '',
          partyType: '',
        },
        surReply: {
          dueDate: '',
          note: '',
          partyType: '',
        },
      },

      [BRIEF_TYPE_OPTIONS.simultaneousSupplemental]: {
        simultaneousSupplemental: {
          dueDate: '',
          note: '',
        },
      },
      [BRIEF_TYPE_OPTIONS.simultaneous]: {
        answering: {
          dueDate: '',
          note: '',
        },
        opening: {
          dueDate: '',
          note: '',
        },
        reply: {
          dueDate: '',
          note: '',
        },
        surReply: {
          dueDate: '',
          note: '',
        },
      },
      [BRIEF_TYPE_OPTIONS.simultaneousMemorandum]: {
        answering: {
          dueDate: '',
          note: '',
        },
        opening: {
          dueDate: '',
          note: '',
        },
        surReply: {
          dueDate: '',
          note: '',
        },
      },
      [BRIEF_TYPE_OPTIONS.simultaneousMemoranda]: {
        answering: {
          dueDate: '',
          note: '',
        },
        memoranda: {
          dueDate: '',
          note: '',
        },
      },
    };

    store.set(
      state.minuteSheetForm.trialBriefSection.briefDetails,
      defaultBriefDetailsValuesMap[value],
    );
  }
};
