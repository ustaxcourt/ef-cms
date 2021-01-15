import { state } from 'cerebral';

/**
 * sets the state.form.startTime values to a default 10:00am value
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.store the cerebral store
 */
export const setDefaultTrialSessionFormValuesAction = ({
  applicationContext,
  store,
}) => {
  const { TRIAL_SESSION_PROCEEDING_TYPES } = applicationContext.getConstants();
  store.set(state.form.startTimeExtension, 'am');
  store.set(state.form.startTimeHours, '10');
  store.set(state.form.startTimeMinutes, '00');
  store.set(state.form.proceedingType, TRIAL_SESSION_PROCEEDING_TYPES.remote);
};
