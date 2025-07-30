import { state } from '@web-client/presenter/app.cerebral';
import { v4 as uuidv4 } from 'uuid';

export const addMinuteSheetFormRowAction = ({ get, props, store }) => {
  const { index, name, section } = props;
  const rows = get(state.minuteSheetForm[section][name]);
  const newEmptyFormRow = getEmptyFormRowByName(name);
  const newObj = {};
  const entries = Object.entries(rows); // Object.keys, Object.values

  for(let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];
    newObj[key] = value;
    if (i === index) {
      newObj[newEmptyFormRow.renderKey] = newEmptyFormRow;
    }
  }
  
  store.set(state.minuteSheetForm[section][name], newObj);
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
