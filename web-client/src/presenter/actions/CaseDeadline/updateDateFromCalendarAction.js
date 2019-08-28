import { state } from 'cerebral';

const formatDateFromCalendar = ({ applicationContext, date }) => {
  let day = date.getDate();
  let year = date.getYear() + 1900;
  let month = date.getMonth() + 1;

  let formattedDate = applicationContext
    .getUtilities()
    .createISODateString(`${year}-${month}-${day}`, 'YYYY-MM-DD');

  return formattedDate;
};

/**
 * sets the state.screenMetadata.filterStartDate and state.screenMetadata.filterEndDate
 * based on the props.startDate and props.endDate passed in.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.screenMetadata.filterStartDate and state.screenMetadata.filterEndDate
 * @param {object} providers.props the cerebral props object used for passing the props.startDate and props.endDate
 */
export const updateDateFromCalendarAction = ({
  applicationContext,
  props,
  store,
}) => {
  const filterStartDate = props.startDate;
  const filterEndDate = props.endDate;

  const formattedFilterStartDate = formatDateFromCalendar({
    applicationContext,
    date: filterStartDate,
  });
  store.set(state.screenMetadata.filterStartDate, formattedFilterStartDate);

  if (filterEndDate) {
    const formattedFilterEndDate = formatDateFromCalendar({
      applicationContext,
      date: filterEndDate,
    });
    store.set(state.screenMetadata.filterEndDate, formattedFilterEndDate);
  } else {
    store.unset(state.screenMetadata.filterEndDate);
  }
};
