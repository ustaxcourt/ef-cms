import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the main filter start and end dates so that the table refreshes with filtered data.
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.screenMetadata.filterStartDate and state.screenMetadata.filterEndDate
 */
export const updateDateRangeForDeadlinesAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  let startDate = get(state.screenMetadata.filterStartDateState);
  let endDate = get(state.screenMetadata.filterEndDateState);

  const [startMonth, startDay, startYear] = startDate.split('/');
  startDate = applicationContext
    .getUtilities()
    .createStartOfDayISO({ day: startDay, month: startMonth, year: startYear });

  const [endMonth, endDay, endYear] = endDate.split('/');
  endDate = applicationContext
    .getUtilities()
    .createEndOfDayISO({ day: endDay, month: endMonth, year: endYear });

  store.set(state.screenMetadata.filterStartDate, startDate);
  store.set(state.screenMetadata.filterEndDate, endDate);

  store.set(state.screenMetadata.filterStartDateState, '');
  store.set(state.screenMetadata.filterEndDateState, '');
};
