import {
  ACTION_FILED_BY_OPTIONS,
  ACTION_FILED_BY_OPTIONS_INVERTED,
  BRIEF_TYPE_OPTIONS,
  MINUTE_SHEET_FORM_SECTION_MAP,
} from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';
import { v4 as uuidv4 } from 'uuid';

export const handlePetitionerNoAppearance = ({ store, value }) => {
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
};

export const handleActionsAndFilingsDocType = ({
  name,
  rowInfo,
  section,
  store,
  value,
}) => {
  if (value !== 'motion') {
    store.unset(state.minuteSheetForm[section][name][rowInfo.key].oralMotion);
    store.unset(state.minuteSheetForm[section][name][rowInfo.key].objection);
  }

  if (value === 'order' || value === 'orderToShowCause') {
    store.set(
      state.minuteSheetForm[section][name][rowInfo.key].filedBy,
      'court',
    );
  }
};

export const handleActionsAndFilingsFiledBy = ({
  name,
  rowInfo,
  section,
  store,
  value,
  previousValue,
}) => {
  const courtFiledByOption =
    ACTION_FILED_BY_OPTIONS_INVERTED[ACTION_FILED_BY_OPTIONS.court];
  const valueChangedFromCourt =
    previousValue === courtFiledByOption && value !== courtFiledByOption;
  const valueChangedToCourt =
    previousValue !== courtFiledByOption && value === courtFiledByOption;
  if (valueChangedFromCourt || valueChangedToCourt || value === '') {
    store.set(
      state.minuteSheetForm[section][name][rowInfo.key].documentType,
      '',
    );
  }
};

export const handleBriefTypeChange = ({ store, value }) => {
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
        partyType: '',
      },
      surReply: {
        dueDate: '',
        note: '',
        partyType: '',
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
};

export const updateTrialSessionMinutesFormAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { name, rowInfo, section, value } = props;
  let previousValue;

  if (rowInfo?.nestedName && rowInfo?.key) {
    previousValue = get(
      state.minuteSheetForm[section][name][rowInfo.key][rowInfo.nestedName],
    );
    store.set(
      state.minuteSheetForm[section][name][rowInfo.key][rowInfo.nestedName],
      value,
    );
  } else if (rowInfo?.key) {
    previousValue = get(state.minuteSheetForm[section][name][rowInfo.key]);
    store.set(state.minuteSheetForm[section][name][rowInfo.key], value);
  } else {
    previousValue = get(state.minuteSheetForm[section][name]);
    store.set(state.minuteSheetForm[section][name], value);
  }

  if (
    section === MINUTE_SHEET_FORM_SECTION_MAP.petitionersSection &&
    name === 'noAppearance'
  ) {
    handlePetitionerNoAppearance({ store, value });
  }

  if (
    section === MINUTE_SHEET_FORM_SECTION_MAP.actionsAndFilingsSection &&
    name === 'actionsAndFilings'
  ) {
    if (rowInfo?.nestedName === 'documentType') {
      handleActionsAndFilingsDocType({ name, rowInfo, section, store, value });
    }
    if (rowInfo?.nestedName === 'filedBy') {
      handleActionsAndFilingsFiledBy({
        name,
        rowInfo,
        section,
        store,
        value,
        previousValue,
      });
    }
  }

  if (
    section === MINUTE_SHEET_FORM_SECTION_MAP.trialBriefSection &&
    name === 'briefType'
  ) {
    handleBriefTypeChange({ store, value });
  }
};
