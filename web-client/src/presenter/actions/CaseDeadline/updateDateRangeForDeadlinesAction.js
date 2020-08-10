import { state } from 'cerebral';

/**
 * sets the main filter start and end dates so that the table refreshes with filtered data.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.screenMetadata.filterStartDate and state.screenMetadata.filterEndDate
 */
export const updateDateRangeForDeadlinesAction = ({ store }) => {
  store.set(
    state.screenMetadata.filterStartDate,
    state.screenMetadata.filterStartDateState,
  );
  store.set(
    state.screenMetadata.filterEndDate,
    state.screenMetadata.filterEndDateState,
  );
};
