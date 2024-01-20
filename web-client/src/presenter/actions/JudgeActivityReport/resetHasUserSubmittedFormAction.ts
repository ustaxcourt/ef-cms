import { state } from '@web-client/presenter/app.cerebral';

export const resetHasUserSubmittedFormAction = ({ store }: ActionProps) => {
  store.set(state.judgeActivityReport.hasUserSubmittedForm, false);
};
