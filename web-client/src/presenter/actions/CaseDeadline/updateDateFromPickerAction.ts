import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.screenMetadata.filterStartDate and state.screenMetadata.filterEndDate
 * based on the props.startDate and props.endDate passed in.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.screenMetadata.filterStartDate and state.screenMetadata.filterEndDate
 * @param {object} providers.props the cerebral props object used for passing the props.startDate and props.endDate
 */
export const updateDateFromPickerAction = ({ props, store }: ActionProps) => {
  const filterStartDate = props.startDate;
  const filterEndDate = props.endDate;

  if (filterStartDate === '') {
    store.unset(state.screenMetadata.filterStartDateState);
  } else if (filterStartDate !== undefined) {
    store.set(state.screenMetadata.filterStartDateState, filterStartDate);
  }
  if (filterEndDate === '') {
    store.unset(state.screenMetadata.filterEndDateState);
  } else if (filterEndDate !== undefined) {
    store.set(state.screenMetadata.filterEndDateState, filterEndDate);
  }
};
