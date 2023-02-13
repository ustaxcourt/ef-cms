import { state } from 'cerebral';

export const setIdleStatusFactoryAction =
  idleStatus =>
  ({ store }) => {
    store.set(state.idleStatus, idleStatus);
  };
