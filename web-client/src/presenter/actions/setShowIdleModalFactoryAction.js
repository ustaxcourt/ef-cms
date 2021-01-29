import { state } from 'cerebral';

export const setShowIdleModalFactoryAction = modalValue => ({ get, store }) => {
  const appInstanceId = get(state.appInstanceId);
  const appInstances = get(state.appInstances);

  // find element in array, update by reference
  const instanceToUpdate = appInstances.find(
    appInstance => appInstance.appInstanceId === appInstanceId,
  );
  instanceToUpdate.showAppTimeoutModal = modalValue;

  store.set(state.appInstances, appInstances);
};
