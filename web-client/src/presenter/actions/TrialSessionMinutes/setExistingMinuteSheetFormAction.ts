import { cloneDeep } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const setExistingMinuteSheetFormAction = ({ props, store }) => {
  const { minuteSheet } = props;
  store.set(state.minuteSheetForm, cloneDeep(minuteSheet));
};
