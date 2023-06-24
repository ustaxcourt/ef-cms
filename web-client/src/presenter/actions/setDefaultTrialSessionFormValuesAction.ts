import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.form.startTime values to a default 10:00am value
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.store the cerebral store
 */
export const setDefaultTrialSessionFormValuesAction = ({
  applicationContext,
  store,
}: ActionProps) => {
  const { TRIAL_SESSION_PROCEEDING_TYPES, TRIAL_SESSION_SCOPE_TYPES } =
    applicationContext.getConstants();
  store.set(state.form.startTimeExtension, 'am');
  store.set(state.form.startTimeHours, '10');
  store.set(state.form.startTimeMinutes, '00');
  store.set(state.form.proceedingType, TRIAL_SESSION_PROCEEDING_TYPES.remote);
  store.set(state.form.sessionScope, TRIAL_SESSION_SCOPE_TYPES.locationBased);
};
