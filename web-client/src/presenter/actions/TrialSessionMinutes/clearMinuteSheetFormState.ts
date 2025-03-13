import { state } from '@web-client/presenter/app.cerebral';

export const clearMinuteSheetFormStateAction = ({ store }) => {
  store.set(state.minuteSheetForm, {});
};
