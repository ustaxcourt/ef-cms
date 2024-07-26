import { state } from '@web-client/presenter/app.cerebral';

export const clearIrsNoticeFormAction = ({ store }: ActionProps) => {
  store.unset(state.form.irsNoticesRedactionAcknowledgement);
  store.unset(state.form.caseType);
};
