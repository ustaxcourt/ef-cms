import { state } from '@web-client/presenter/app.cerebral';

export const removeMinuteSheetFormRowAction = ({ get, props, store }) => {
  const { key, name, section } = props;
  const rows = get(state.minuteSheetForm[section][name]);
  delete rows[key];
  store.set(state.minuteSheetForm[section][name], rows);
};
