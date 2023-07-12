import { state } from 'cerebral';

/**
 * sets the state.form.startDate and state.form.endDate
 * based on the props.startDate and props.endDate passed in.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.form.startDate and state.form.endDate
 * @param {object} providers.props the cerebral props object used for passing the props.startDate and props.endDate
 */
export const updateDateFromPickerFromFormAction = ({
  props,
  store,
}: ActionProps) => {
  const filterStartDate = props.startDate;
  const filterEndDate = props.endDate;

  if (filterStartDate === '') {
    store.unset(state.form.startDate);
  } else if (filterStartDate !== undefined) {
    store.set(state.form.startDate, filterStartDate);
  }
  if (filterEndDate === '') {
    store.unset(state.form.endDate);
  } else if (filterEndDate !== undefined) {
    store.set(state.form.endDate, filterEndDate);
  }
};
