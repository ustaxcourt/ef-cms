import { state } from 'cerebral';

export const setIdleStatusFactoryAction = idleStatus => ({ get, store }) => {
  const appInstanceId = get(state.appInstanceId);
  const appInstances = get(state.appInstances);

  // find element in array, update by reference
  const instanceToUpdate = appInstances.find(
    appInstance => appInstance.appInstanceId === appInstanceId,
  );
  instanceToUpdate.idleStatus = idleStatus;

  store.set(state.appInstances, appInstances);
};
