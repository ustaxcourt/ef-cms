import {
  compute24HrTimeAndUpdateState,
  computeTermAndUpdateState,
} from './computeTrialSessionFormDataAction';
import { state } from 'cerebral';

/**
 * computes the trial session data based on user input for submission
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store function
 */
export const computeSubmitTrialSessionDataAction = ({
  get,
  store,
}: ActionProps) => {
  const form = get(state.form);

  computeTermAndUpdateState(
    {
      month: form.startDateMonth,
      year: form.startDateYear,
    },
    store,
  );

  compute24HrTimeAndUpdateState(
    {
      extension: form.startTimeExtension,
      hours: form.startTimeHours,
      minutes: form.startTimeMinutes,
    },
    store,
  );

  if (form.alternateTrialClerkName) {
    store.set(state.form.trialClerkId, undefined);
    store.set(state.form.trialClerk, undefined);
  }
};
