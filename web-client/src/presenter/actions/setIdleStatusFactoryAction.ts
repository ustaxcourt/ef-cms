import { state } from 'cerebral';

export const setIdleStatusFactoryAction =
  idleStatus =>
  ({ store }: ActionProps) => {
    store.set(state.idleStatus, idleStatus);
  };
