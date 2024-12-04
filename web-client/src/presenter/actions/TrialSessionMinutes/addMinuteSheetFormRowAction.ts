import { cloneDeep } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { v4 as uuidv4 } from 'uuid';

export const addMinuteSheetFormRowAction = ({ get, props, store }) => {
  const { section } = props;

  const rows = get(state.minuteSheetForm[section]);
  const updatedRows = addEmptyRow(rows, section);

  store.set(state.minuteSheetForm[section], updatedRows);
};

function addEmptyRow(arr, section) {
  const emptyRowMap = {
    respondents: { datesOfAppearance: '', name: '' },
  };

  const newEmptyRow = cloneDeep(emptyRowMap[section]);
  newEmptyRow.renderKey = uuidv4();
  const newArray = cloneDeep(arr);
  newArray.push(newEmptyRow);
  return newArray;
}
