import { state } from '@web-client/presenter/app.cerebral';
import { v4 as uuidv4 } from 'uuid';

export const addMinuteSheetFormRowAction = ({ get, props, store }) => {
  const { name, section } = props;
  const rows = get(state.minuteSheetForm[section][name]);
  const newEmptyFormRow = getEmptyFormRowByName(name);
  rows[newEmptyFormRow.renderKey] = newEmptyFormRow;
  store.set(state.minuteSheetForm[section][name], rows);
};

const getEmptyFormRowByName = (name: string) => {
  const newRenderKey = uuidv4();

  const nameRowMap = {
    actionsAndFilings: {
      date: '',
      documentType: '',
      filedBy: '',
      isOnDocketRecord: false,
      note: '',
      renderKey: newRenderKey,
      status: '',
    },
    exhibits: {
      description: '',
      note: '',
      renderKey: newRenderKey,
      status: '',
    },
    motions: {
      date: '',
      filedBy: '',
      note: '',
      oralMotion: false,
      renderKey: newRenderKey,
      status: '',
      type: '',
    },
    petitionerWitnesses: {
      name: '',
      renderKey: newRenderKey,
    },
    petitioners: {
      datesOfAppearence: '',
      name: '',
      renderKey: newRenderKey,
      role: '',
    },
    recalled: {
      date: '',
      note: '',
      renderKey: newRenderKey,
      transcriptOrdered: false,
    },
    respondentWitnesses: {
      name: '',
      renderKey: newRenderKey,
    },
    respondents: {
      datesOfAppearence: '',
      name: '',
      renderKey: newRenderKey,
    },
  };

  return nameRowMap[name];
};
