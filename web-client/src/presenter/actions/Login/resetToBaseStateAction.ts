import { baseState } from '@web-client/presenter/state';
import { cloneDeep } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const resetToBaseStateAction = ({ store }: ActionProps) => {
  Object.entries(cloneDeep(baseState)).forEach(([key, value]) => {
    const stateSlicesToPersist = [
      'maintenanceMode',
      'featureFlags',
      'header',
      'constants',
      'scanner',
      'clientConnectionId',
      'caseDetail', // We persist this only because old cerebral tests depend on it. It should be removed once those tests are converted to Cypress
      'pendingReports', // We persist this only because old cerebral tests depend on it. It should be removed once those tests are converted to Cypress
    ];
    if (stateSlicesToPersist.includes(key)) return;
    store.set(state[key], value);
  });
};
