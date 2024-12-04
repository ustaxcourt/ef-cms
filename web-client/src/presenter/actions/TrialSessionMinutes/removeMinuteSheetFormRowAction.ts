import { state } from '@web-client/presenter/app.cerebral';

export const removeMinuteSheetFormRowAction = ({ get, props, store }) => {
  const { renderKey, section } = props;

  const rows = get(state.minuteSheetForm[section]);
  const updatedRows = rows.filter(row => row.renderKey !== renderKey);

  store.set(state.minuteSheetForm[section], updatedRows);
};
