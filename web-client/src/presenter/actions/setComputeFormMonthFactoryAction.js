import { state } from 'cerebral';

export const setComputeFormMonthFactoryAction = key => {
  const setComputeFormYearAction = ({ get, store }) => {
    const monthValue = get(state.form[key]);
    store.set(state.form.month, monthValue);
  };

  return setComputeFormYearAction;
};
