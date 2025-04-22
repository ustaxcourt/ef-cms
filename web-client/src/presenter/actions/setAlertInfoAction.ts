import { state } from '@web-client/presenter/app.cerebral';

export const setAlertInfoAction = ({
  props,
  store,
}: ActionProps<{ alertInfo: any }>) => {
  store.set(state.alertInfo, props.alertInfo);
};
