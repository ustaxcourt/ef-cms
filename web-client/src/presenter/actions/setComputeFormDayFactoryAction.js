import { state } from 'cerebral';

export const setComputeFormDayFactoryAction = key => {
  const setComputeFormDayAction = ({ get, store }) => {
    const dayValue = get(state.form[key]);
    store.set(state.form.day, dayValue);
  };

  return setComputeFormDayAction;
};
