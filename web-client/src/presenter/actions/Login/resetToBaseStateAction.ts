import { baseState } from '@web-client/presenter/state';
import { cloneDeep } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const resetToBaseStateAction = ({ store }: ActionProps) => {
  Object.entries(cloneDeep(baseState)).forEach(([key, value]) => {
    const stateSlicesToPersist = [
      'maintenanceMode',
      'featureFlags',
      'idleLogoutState',
      'idleStatus',
      'lastIdleAction',
      'header',
    ];
    if (stateSlicesToPersist.includes(key)) return;
    store.set(state[key], value);
  });
};
