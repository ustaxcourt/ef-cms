import { state } from 'cerebral';

export const updateHasIrsNoticeAction = async ({ store }) => {
  store.set(state.form.caseType, null);
  store.set(state.form.month, null);
  store.set(state.form.day, null);
  store.set(state.form.year, null);
};
