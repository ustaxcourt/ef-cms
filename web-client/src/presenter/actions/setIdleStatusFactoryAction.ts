import { state } from '@web-client/presenter/app.cerebral';

export const setIdleStatusFactoryAction =
  idleStatus =>
  ({ store }: ActionProps) => {
    store.set(state.idleStatus, idleStatus);
  };
