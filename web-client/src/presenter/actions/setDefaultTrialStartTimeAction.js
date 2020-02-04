import { state } from 'cerebral';

/**
 * sets the state.form.startTime values to a default 10:00am value
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const setDefaultTrialStartTimeAction = ({ store }) => {
  store.set(state.form.startTimeExtension, 'am');
  store.set(state.form.startTimeHours, '10');
  store.set(state.form.startTimeMinutes, '00');
};
