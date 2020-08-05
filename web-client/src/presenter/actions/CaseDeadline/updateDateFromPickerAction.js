import { state } from 'cerebral';

/**
 * sets the state.screenMetadata.filterStartDate and state.screenMetadata.filterEndDate
 * based on the props.startDate and props.endDate passed in.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.screenMetadata.filterStartDate and state.screenMetadata.filterEndDate
 * @param {object} providers.props the cerebral props object used for passing the props.startDate and props.endDate
 */
export const updateDateFromPickerAction = ({ props, store }) => {
  const filterStartDate = props.startDate;
  const filterEndDate = props.endDate;

  const formattedFilterStartDate = filterStartDate;
  store.set(state.screenMetadata.filterStartDate, formattedFilterStartDate);

  if (filterEndDate) {
    const formattedFilterEndDate = filterEndDate;
    store.set(state.screenMetadata.filterEndDate, formattedFilterEndDate);
  } else {
    store.unset(state.screenMetadata.filterEndDate);
  }
};
