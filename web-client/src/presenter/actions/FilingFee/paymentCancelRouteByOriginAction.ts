import { state } from '@web-client/presenter/app.cerebral';

export const paymentCancelRouteByOriginAction = ({
  path,
  props,
  store,
}: ActionProps<{ origin?: string }>) => {
  if (props.origin === 'dashboard') {
    window.history.replaceState({}, '', '/');
    store.set(state.currentPage, 'DashboardExternalUser');
    return path.dashboard();
  }

  return path.petition();
};
