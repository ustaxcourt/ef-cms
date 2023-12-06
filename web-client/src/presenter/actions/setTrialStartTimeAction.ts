import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.form.startTime values to previously entered and saved value
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setTrialStartTimeAction = ({ props, store }: ActionProps) => {
  store.set(state.form.startTimeExtension, props.startTimeExtension);
  store.set(state.form.startTimeHours, props.startTimeHours);
  store.set(state.form.startTimeMinutes, props.startTimeMinutes);
};
