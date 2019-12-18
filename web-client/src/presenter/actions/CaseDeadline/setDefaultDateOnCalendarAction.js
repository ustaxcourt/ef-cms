import { state } from 'cerebral';

/**
 * sets the state.calendarStartDate
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.calendarStartDate
 */
export const setDefaultDateOnCalendarAction = ({ store }) => {
  const todaysDate = new Date();
  store.set(state.calendarStartDate, todaysDate);
};
