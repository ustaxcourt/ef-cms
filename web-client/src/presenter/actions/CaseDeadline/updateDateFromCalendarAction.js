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
 * sets the state.filterStartDate and state.filterEndDate
 * based on the props.startDate and props.endDate passed in.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.filterStartDate and state.filterEndDate
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
  store.set(state.filterStartDate, formattedFilterStartDate);

  if (filterEndDate) {
    const formattedFilterEndDate = formatDateFromCalendar({
      applicationContext,
      date: filterEndDate,
    });
    store.set(state.filterEndDate, formattedFilterEndDate);
  } else {
    store.unset(state.filterEndDate);
  }
};
