import { cloneDeep } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const setExistingMinuteSheetFormAction = ({ get, props, store }) => {
  const { minuteSheet } = props;
  console.log('mystery minute sheet', minuteSheet);
  const parsedMinuteSheet = JSON.parse(minuteSheet.minuteSheet);
  console.log(
    'minute sheet passed to setExistingMinuteSheetFormAction',
    parsedMinuteSheet,
  );
  store.set(state.minuteSheetForm, cloneDeep(parsedMinuteSheet));

  const afterSet = get(state.minuteSheetForm);
  console.log('after set', afterSet);
};
