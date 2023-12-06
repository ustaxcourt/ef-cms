import {
  compute24HrTimeAndUpdateState,
  computeTermAndUpdateState,
} from './computeTrialSessionFormDataAction';
import { state } from '@web-client/presenter/app.cerebral';

export const computeSubmitTrialSessionDataAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const form = get(state.form);

  computeTermAndUpdateState(
    { startDate: form.startDate },
    store,
    applicationContext,
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
