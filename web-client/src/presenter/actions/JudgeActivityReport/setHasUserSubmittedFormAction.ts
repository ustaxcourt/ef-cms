import { state } from '@web-client/presenter/app.cerebral';

export const setHasUserSubmittedFormAction = ({ store }: ActionProps) => {
  store.set(state.judgeActivityReport.hasUserSubmittedForm, true);
};
