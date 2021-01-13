import { state } from 'cerebral';

export const setComputeFormYearFactoryAction = key => {
  const setComputeFormYearAction = ({ get, store }) => {
    const yearValue = get(state.form[key]);
    store.set(state.form.year, yearValue);
  };

  return setComputeFormYearAction;
};
