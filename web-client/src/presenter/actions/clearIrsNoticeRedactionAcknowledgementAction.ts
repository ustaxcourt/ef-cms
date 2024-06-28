import { state } from '@web-client/presenter/app.cerebral';

export const clearIrsNoticeRedactionAcknowledgementAction = ({
  store,
}: ActionProps) => {
  store.unset(state.form.irsNoticesRedactionAcknowledgement);
};
